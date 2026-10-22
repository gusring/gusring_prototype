import { FORM_FONT, FORM_FONT_WEIGHT, INK, marksFor } from '../forms/render';
import { FormDef, Mark, Values } from '../forms/types';

// 화면의 FormSvg와 같은 Mark를 Canvas에 그려 PNG로 만든다.

const SCALE = 2;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

function drawMark(ctx: CanvasRenderingContext2D, m: Mark) {
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  switch (m.kind) {
    case 'text': {
      const align = m.box.align ?? 'left';
      ctx.font = `${FORM_FONT_WEIGHT} ${m.size}px ${FORM_FONT}`;
      ctx.textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
      ctx.textBaseline = 'middle';
      const x = align === 'left' ? m.box.x : align === 'center' ? m.box.x + m.box.w / 2 : m.box.x + m.box.w;
      ctx.fillText(m.text, x, m.box.y + m.box.h / 2);
      break;
    }
    case 'circle':
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(m.at.x, m.at.y, 15, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'check':
      ctx.lineWidth = 3.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(m.at.x - 8, m.at.y);
      ctx.lineTo(m.at.x - 2, m.at.y + 7);
      ctx.lineTo(m.at.x + 10, m.at.y - 10);
      ctx.stroke();
      break;
  }
}

export async function renderFormPng(form: FormDef, values: Values): Promise<string> {
  await document.fonts.ready;
  const img = await loadImage(form.image);
  const canvas = document.createElement('canvas');
  canvas.width = form.width * SCALE;
  canvas.height = form.height * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, form.width, form.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, form.width, form.height);
  for (const f of form.fields) for (const m of marksFor(f, values[f.id])) drawMark(ctx, m);
  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
