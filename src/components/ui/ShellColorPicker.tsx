import { useState } from 'react';

type Point = { x: number; y: number };

export function ShellColorPicker({ image }: { image: string }) {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [answer, setAnswer] = useState<{ name: string; hex: string } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function sample() {
    setBusy(true); setError(''); setAnswer(null);
    try {
      if (points.length < 3) throw new Error('Chọn ít nhất 3 điểm quanh vùng thân.');
      const img = new Image(); img.crossOrigin = 'anonymous'; img.src = image;
      await img.decode();
      const scale = Math.min(1, 800 / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale); canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Trình duyệt chưa hỗ trợ lấy màu.');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x * canvas.width, p.y * canvas.height) : ctx.moveTo(p.x * canvas.width, p.y * canvas.height));
      ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
      const mask = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const groups: Record<string, number[][]> = {}; let area = 0; let valid = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        if (mask[i + 3] < 250) continue;
        area++;
        const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
        const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
        const saturation = max ? delta / max * 255 : 0;
        if (max < 35 || (max > 245 && saturation < 35)) continue;
        valid++;
        let hue = delta === 0 ? 0 : max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
        hue *= 30;
        const name = max < 65 ? 'Sẫm màu' : saturation < 45 ? (max >= 200 ? 'Trắng / xám nhạt' : 'Xám') :
          hue < 10 || hue >= 170 ? 'Đỏ / hồng' : hue < 25 ? 'Cam / nâu' : hue < 35 ? 'Vàng' : hue < 85 ? 'Xanh lục' : hue < 135 ? 'Xanh lam' : 'Tím / hồng';
        (groups[name] ??= []).push([r, g, b]);
      }
      if (area < 256 || valid < 256 || valid / area < .5) throw new Error('Vùng chọn quá nhỏ, quá tối hoặc phản sáng. Hãy chọn lại phần vỏ nhìn rõ.');
      const [name, colors] = Object.entries(groups).sort((a, b) => b[1].length - a[1].length)[0];
      const hex = '#' + [0, 1, 2].map(channel => colors.map(p => p[channel]).sort((a, b) => a - b)[Math.floor(colors.length / 2)].toString(16).padStart(2, '0')).join('');
      setAnswer({ name, hex });
    } catch (e) { setError(e instanceof Error ? e.message : 'Không đọc được ảnh. Hãy tải ảnh từ máy và thử lại.'); }
    finally { setBusy(false); }
  }

  return <div className="col-span-full rounded-xl border border-purple-200 p-3 space-y-3">
    <button type="button" className="font-semibold text-purple-700" onClick={() => setOpen(!open)}>{open ? 'Ẩn chọn vùng' : '🎨 Tự chọn vùng thân để lấy màu'}</button>
    {open && <>
      <p className="text-xs text-slate-500">Chạm các điểm quanh một vùng vỏ rõ nét, tránh bàn tay, râu, chân và chỗ phản sáng. Có thể chọn một phần thân. Vùng xanh sẽ được lấy màu.</p>
      <div className="relative w-full">
        <img src={image} alt="Ảnh để chọn vùng vỏ tôm" className="block w-full" draggable={false} />
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="absolute inset-0 w-full h-full cursor-crosshair touch-manipulation"
          aria-label="Chạm quanh vùng thân để tạo polygon" onClick={e => {
            const box = e.currentTarget.getBoundingClientRect();
            if (points.length >= 80) return;
            setPoints([...points, { x: Math.max(0, Math.min(1, (e.clientX - box.left) / box.width)), y: Math.max(0, Math.min(1, (e.clientY - box.top) / box.height)) }]); setAnswer(null); setError('');
          }}>
          <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(0,220,100,.25)" stroke="#00bb66" strokeWidth=".005" />
          {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r=".008" fill="#00bb66" />)}
        </svg>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <button type="button" onClick={() => { setPoints(points.slice(0, -1)); setAnswer(null); }}>Xóa điểm cuối</button>
        <button type="button" onClick={() => { setPoints([]); setAnswer(null); setError(''); }}>Chọn lại</button>
        <button type="button" disabled={points.length < 3 || busy} onClick={sample} className="rounded-lg bg-purple-700 text-white px-3 py-2 disabled:opacity-40">{busy ? 'Đang lấy màu…' : 'Lấy màu vùng chọn'}</button>
      </div>
      {error && <p role="alert" className="text-sm text-amber-700">{error}</p>}
      {answer && <p role="status" className="text-sm font-semibold">Màu vùng bạn chọn: <span style={{ backgroundColor: answer.hex }} className="inline-block w-4 h-4 rounded border align-middle" /> {answer.name} ({answer.hex})</p>}
      <p className="text-xs text-slate-500">Chỉ mô tả màu vùng bạn chọn dưới ánh sáng ảnh. Không phải kết quả mask tự động hay đánh giá sức khỏe/độ trong suốt. Kết quả này chỉ hiển thị tại đây, chưa lưu vào lịch sử.</p>
    </>}
  </div>;
}
