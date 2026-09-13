interface Env {
  ADMIN_KV?: KVNamespace;
}

const memPdfStore = new Map<string, ArrayBuffer>();
const memMetaStore = new Map<string, any>();

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Course ID parameter "id" is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Info query param to check existence and metadata
    if (url.searchParams.get('info') === 'true') {
      let meta: any = null;
      if (context.env.ADMIN_KV) {
        const rawMeta = await context.env.ADMIN_KV.get(`syllabus_meta_${id}`);
        if (rawMeta) {
          try { meta = JSON.parse(rawMeta); } catch (e) {}
        }
      } else {
        meta = memMetaStore.get(id) || null;
      }
      return new Response(JSON.stringify({
        success: true,
        exists: !!meta,
        courseId: id,
        meta
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    let pdfBuffer: ArrayBuffer | null = null;
    let meta: any = null;

    if (context.env.ADMIN_KV) {
      pdfBuffer = await context.env.ADMIN_KV.get(`syllabus_pdf_${id}`, 'arrayBuffer');
      const rawMeta = await context.env.ADMIN_KV.get(`syllabus_meta_${id}`);
      if (rawMeta) {
        try { meta = JSON.parse(rawMeta); } catch (e) {}
      }
    } else {
      pdfBuffer = memPdfStore.get(id) || null;
      meta = memMetaStore.get(id) || null;
    }

    if (!pdfBuffer || pdfBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Syllabus PDF not found for this course' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const fileName = meta?.fileName || `${id}_syllabus.pdf`;
    const safeFileName = encodeURIComponent(fileName);
    const downloadName = fileName.replace(/[^\w.-]/g, '_');

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${downloadName}"; filename*=UTF-8''${safeFileName}`,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const contentType = context.request.headers.get('content-type') || '';
    let courseId = '';
    let arrayBuffer: ArrayBuffer | null = null;
    let fileName = 'syllabus.pdf';
    let fileSize = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      courseId = (formData.get('courseId') as string) || '';
      const file = formData.get('file') as File | null;
      if (file && typeof file.arrayBuffer === 'function') {
        arrayBuffer = await file.arrayBuffer();
        fileName = file.name || 'syllabus.pdf';
        fileSize = formatBytes(file.size);
      }
    } else {
      const body = await context.request.json().catch(() => ({})) as any;
      courseId = body.courseId || '';
      fileName = body.fileName || 'syllabus.pdf';
      fileSize = body.fileSize || '';

      if (body.base64) {
        const cleanB64 = body.base64.replace(/^data:[^;]+;base64,/, '');
        const binaryString = atob(cleanB64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        arrayBuffer = bytes.buffer;
        if (!fileSize) {
          fileSize = formatBytes(len);
        }
      }
    }

    if (!courseId) {
      return new Response(JSON.stringify({ success: false, error: 'courseId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No PDF content provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const updatedAt = new Date().toISOString();
    const metaData = { fileName, fileSize, updatedAt };

    if (context.env.ADMIN_KV) {
      await context.env.ADMIN_KV.put(`syllabus_pdf_${courseId}`, arrayBuffer);
      await context.env.ADMIN_KV.put(`syllabus_meta_${courseId}`, JSON.stringify(metaData));
    } else {
      memPdfStore.set(courseId, arrayBuffer);
      memMetaStore.set(courseId, metaData);
    }

    return new Response(JSON.stringify({
      success: true,
      courseId,
      url: `/api/syllabus-pdf?id=${encodeURIComponent(courseId)}`,
      fileName,
      fileSize,
      updatedAt,
      message: 'Syllabus PDF stored successfully in Cloudflare KV'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

export const onRequestPut = onRequestPost;

export const onRequestDelete = async (context: { request: Request; env: Env }) => {
  try {
    const url = new URL(context.request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      const body = await context.request.json().catch(() => ({})) as any;
      id = body.courseId || body.id;
    }

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Course ID parameter "id" is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    if (context.env.ADMIN_KV) {
      await context.env.ADMIN_KV.delete(`syllabus_pdf_${id}`);
      await context.env.ADMIN_KV.delete(`syllabus_meta_${id}`);
    } else {
      memPdfStore.delete(id);
      memMetaStore.delete(id);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Syllabus PDF for ${id} successfully deleted`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
