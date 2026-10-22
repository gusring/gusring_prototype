import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Lang as LangId } from '../forms/types';

type I18n = { ko: string; en: string; zh: string; ja: string; vi: string };
const tx = (o: I18n, l: LangId): string => o[l] ?? o.ko;

interface Win  { num?: string; title: I18n; desc?: I18n; }
interface Sec  { id: string; label: I18n; color: string; startDeg: number; endDeg: number; windows: Win[]; }

const SECTIONS: Sec[] = [
  {
    id: 'vehicle', color: '#1e3170',
    label: { ko: '자동차민원', en: 'Vehicle Affairs', zh: '汽车民愿', ja: '自動車民願', vi: 'Thủ tục hành chính về ô tô' },
    startDeg: 215, endDeg: 252,
    windows: [
      {
        num: '21–26',
        title: { ko: '자동차·이륜차 등록 통합민원', en: 'Vehicle & Motorcycle Registration', zh: '汽车·摩托车综合登记', ja: '自動車・二輪車登録総合窓口', vi: 'Đăng ký xe ô tô & xe máy' },
        desc:  { ko: '신규, 이전, 변경, 저당, 말소, 제증명 등', en: 'New registration, transfer, change, mortgage, cancellation, certificates', zh: '新登记、转让、变更、抵押、注销、证明等', ja: '新規、移転、変更、抵当、抹消、証明など', vi: 'Đăng ký mới, chuyển nhượng, thay đổi, thế chấp, hủy, chứng nhận' },
      },
    ],
  },
  {
    id: 'tax', color: '#d63d68',
    label: { ko: '세무민원', en: 'Tax Affairs', zh: '税务民愿', ja: '税務民願', vi: 'Thuế vụ' },
    startDeg: 252, endDeg: 302,
    windows: [
      { num: '16',    title: { ko: '지방세 통합상담',                   en: 'Local Tax Consultation',                   zh: '地方税综合咨询',           ja: '地方税総合相談',           vi: 'Tư vấn thuế địa phương'      }, desc: { ko: '☎ 02-2627-2528', en: '☎ 02-2627-2528', zh: '☎ 02-2627-2528', ja: '☎ 02-2627-2528', vi: '☎ 02-2627-2528' } },
      { num: '17',    title: { ko: '부동산취득세 자진신고 (개인)',        en: 'Real Estate Acquisition Tax (Individual)', zh: '房产取得税自申报(个人)',     ja: '不動産取得税自己申告(個人)', vi: 'Thuế mua BĐS tự khai (cá nhân)' }, desc: { ko: '☎ 02-2627-2529', en: '☎ 02-2627-2529', zh: '☎ 02-2627-2529', ja: '☎ 02-2627-2529', vi: '☎ 02-2627-2529' } },
      { num: '18',    title: { ko: '지방세 체납조회 · 납세증명',          en: 'Tax Delinquency & Payment Certificate',    zh: '地方税欠缴查询·纳税证明',   ja: '地方税滞納照会・納税証明',  vi: 'Kiểm tra nợ thuế & chứng nhận' }, desc: { ko: '지방세납세 증명서 발급 등', en: 'Issuance of tax payment certificates', zh: '地方税纳税证明书发放等', ja: '地方税納税証明書発行など', vi: 'Cấp giấy chứng nhận nộp thuế' } },
      { num: '19–20', title: { ko: '자동차 취득세 신고',                 en: 'Vehicle Acquisition Tax Report',          zh: '汽车取得税申报',           ja: '自動車取得税申告',         vi: 'Khai thuế mua xe'            } },
    ],
  },
  {
    id: 'realestate', color: '#7c3aed',
    label: { ko: '부동산민원', en: 'Real Estate Affairs', zh: '房产民愿', ja: '不動産民願', vi: 'Bất động sản' },
    startDeg: 302, endDeg: 62,
    windows: [
      { num: '12', title: { ko: '부동산중개업 개설등록',   en: 'Real Estate Agency Registration', zh: '房产中介开业登记',   ja: '不動産仲介業開設登録', vi: 'Đăng ký trung tâm BĐS'      }, desc: { ko: '이전, 폐업, 상호변경 등',                          en: 'Transfer, closure, name change, etc.',              zh: '转让、停业、名称变更等',         ja: '移転、廃業、商号変更など',     vi: 'Chuyển nhượng, đóng cửa, đổi tên'          } },
      { num: '13', title: { ko: '부동산 거래신고 · 검인', en: 'Real Estate Transaction Report',  zh: '房产交易申报·认证',  ja: '不動産取引申告・検認', vi: 'Khai báo giao dịch BĐS'    }, desc: { ko: '부동산 거래의 해제 등',                            en: 'Cancellation of transactions, etc.',                zh: '房产交易的解除等',               ja: '不動産取引の解除など',         vi: 'Hủy giao dịch BĐS, v.v.'                  } },
      { num: '14', title: { ko: '부동산 증명 발급',       en: 'Real Estate Certificate',         zh: '房产证明发放',       ja: '不動産証明発行',       vi: 'Cấp giấy chứng nhận BĐS'  }, desc: { ko: '토지대장, 건축물대장, 토지이용계획, 개별공시지가 등', en: 'Land register, building register, land use plan, land price, etc.', zh: '土地台账、建筑物台账、土地利用计划、公示地价等', ja: '土地台帳、建物台帳、土地利用計画、公示地価など', vi: 'Sổ đất, sổ nhà, quy hoạch, giá đất, v.v.' } },
      { num: '15', title: { ko: '지적측량신청',           en: 'Cadastral Survey Application',    zh: '地籍测量申请',       ja: '地籍測量申請',         vi: 'Đơn đo đạc địa chính'     } },
    ],
  },
  {
    id: 'integrated', color: '#2563eb',
    label: { ko: '통합민원', en: 'Integrated Services', zh: '综合民愿', ja: '総合民願', vi: 'Dịch vụ tổng hợp' },
    startDeg: 62, endDeg: 145,
    windows: [
      { num: '1–3', title: { ko: '여권신청',                                  en: 'Passport Application',                       zh: '护照申请',                   ja: 'パスポート申請',               vi: 'Đăng ký hộ chiếu'                   } },
      { num: '4',   title: { ko: '여권수령',                                  en: 'Passport Collection',                        zh: '护照领取',                   ja: 'パスポート受取',               vi: 'Nhận hộ chiếu'                      } },
      { num: '5–6', title: { ko: '증명서 발급',                               en: 'Certificate Issuance',                       zh: '证明书发放',                 ja: '証明書発行',                   vi: 'Cấp giấy chứng nhận'                },
                    desc:  { ko: '등·초본, 개인인감, 본인서명, 가족관계증명서 등', en: 'Residence cert, seal cert, signature cert, family cert, etc.', zh: '住民登录·抄本、个人印章、本人签名、家庭关系证明等', ja: '住民票・抄本、個人印鑑、本人署名、家族関係証明など', vi: 'Hộ khẩu, con dấu, chữ ký, chứng nhận quan hệ gia đình...' } },
      { num: '7',   title: { ko: '외국인체류지변경, 어디서나민원, 자격증재발급', en: 'Foreigner Residence Change, Any-Counter, Certificate Reissue', zh: '外国人居留地变更、随处民愿、证书补发', ja: '外国人居留地変更・どこでも窓口・資格証再発行', vi: 'Đổi địa chỉ ngoại kiều, cửa sổ bất kỳ, cấp lại chứng chỉ' } },
      { num: '8',   title: { ko: '유기한민원 접수, 각종 면허발급',             en: 'Deferred Petition & License Issuance',      zh: '延期民愿受理、各类许可证发放', ja: '猶予民願受付・各種免許発行',   vi: 'Tiếp nhận đơn & cấp giấy phép'      } },
      { num: '9',   title: { ko: '가족관계등록신고',                          en: 'Family Register Notification',              zh: '家庭关系登记申报',           ja: '家族関係登録申告',             vi: 'Khai báo đăng ký hộ tịch'           } },
      { num: '10',  title: { ko: '공인관리, 행정정보공개',                    en: 'Official Seal Mgmt & Info Disclosure',       zh: '公章管理、行政信息公开',     ja: '公印管理・行政情報公開',       vi: 'Quản lý con dấu & công khai thông tin' } },
      { num: '11',  title: { ko: '우편접수·발송',                            en: 'Mail Reception & Dispatch',                 zh: '邮件受理·发送',             ja: '郵便受付・発送',               vi: 'Nhận & gửi bưu phẩm'                } },
    ],
  },
];

// ── SVG arc helper ────────────────────────────────────────────
const CX = 160, CY = 118, OR = 92, IR = 56;

function arcPath(startDeg: number, endDeg: number): string {
  const rad = (d: number) => (d * Math.PI) / 180;
  const px  = (R: number, d: number) =>
    `${(CX + R * Math.sin(rad(d))).toFixed(1)},${(CY - R * Math.cos(rad(d))).toFixed(1)}`;
  const ne = endDeg <= startDeg ? endDeg + 360 : endDeg;
  const la = ne - startDeg > 180 ? 1 : 0;
  return `M${px(OR,startDeg)} A${OR},${OR} 0 ${la},1 ${px(OR,ne)} L${px(IR,ne)} A${IR},${IR} 0 ${la},0 ${px(IR,startDeg)} Z`;
}

// ── Component ─────────────────────────────────────────────────
const OfficeMap: React.FC<{ lang: LangId }> = ({ lang }) => {
  const [sel, setSel] = useState<Sec | null>(null);

  return (
    <>
      <div className="mt-4 rounded-2xl border border-gusring-border bg-gusring-bg overflow-hidden">

        {/* 헤더 */}
        <div className="px-4 pt-3 pb-1">
          <p className="font-black text-[13px] text-gusring-text">
            {tx({ ko: '창구 안내', en: 'Counter Guide', zh: '窗口指南', ja: '窓口案内', vi: 'Hướng dẫn quầy' }, lang)}
          </p>
          <p className="text-[11px] text-gusring-text-hint mt-0.5">
            {tx({ ko: '구역을 눌러 창구 정보를 확인하세요', en: 'Tap a section to see counter details', zh: '点击区域查看窗口信息', ja: 'セクションをタップして窓口情報を確認', vi: 'Nhấn vào khu vực để xem thông tin quầy' }, lang)}
          </p>
        </div>

        {/* 구조도 SVG */}
        <svg viewBox="0 0 320 278" className="w-full">
          {SECTIONS.map(s => (
            <path
              key={s.id}
              d={arcPath(s.startDeg, s.endDeg)}
              fill={s.color}
              style={{ opacity: sel ? (sel.id === s.id ? 1 : 0.4) : 0.88, transition: 'opacity 150ms', cursor: 'pointer' }}
              onClick={() => setSel(s)}
            />
          ))}

          {/* ── 왼쪽 하단 시설 ── */}
          <line x1="107" y1="196" x2="107" y2="268" stroke="#D1D5DB" strokeWidth="0.8" />
          {([
            { ko: '전문가상담실',      en: 'Consultation Room',    zh: '专家咨询室',       ja: '専門家相談室',         vi: 'Phòng tư vấn'         },
            { ko: '팩스·복사·건강코너', en: 'Fax·Copy·Health',      zh: '传真·复印·健康角', ja: 'FAX·コピー·健康コーナー', vi: 'Fax·Copy·Sức khỏe'  },
            { ko: '정부24 PC',         en: 'Gov24 Kiosk',          zh: '政府24 PC',        ja: '政府24 PC',            vi: 'Máy Gov24'            },
            { ko: '법인무인민원발급기', en: 'Corp. Self-Service',   zh: '法人无人证件机',   ja: '法人無人発行機',       vi: 'Máy tự phục vụ'       },
          ] as I18n[]).map((label, i) => (
            <g key={`ld-${i}`}>
              <circle cx={107} cy={207 + i * 20} r={3.5} fill="#2563eb" />
              <text x={101} y={207 + i * 20 + 3} textAnchor="end" fontSize="7.5" fill="#374151" fontWeight="600">
                {tx(label, lang)}
              </text>
            </g>
          ))}

          {/* ── 오른쪽 하단 시설 ── */}
          <line x1="213" y1="196" x2="213" y2="268" stroke="#D1D5DB" strokeWidth="0.8" />
          {([
            { ko: '민원직원 휴게실',      en: 'Staff Lounge',         zh: '职员休息室',       ja: '職員休憩室',           vi: 'Phòng nghỉ nhân viên' },
            { ko: '서울금융복지상담센터', en: 'Seoul Finance Center', zh: '首尔金融福利中心', ja: 'ソウル金融福祉センター', vi: 'Trung tâm Tài chính'  },
            { ko: '취업정보센터',         en: 'Job Info Center',      zh: '就业信息中心',     ja: '就職情報センター',     vi: 'Trung tâm Việc làm'   },
            { ko: '안내데스크·우선배려창구', en: 'Info·Priority Desk', zh: '服务台·优先窗口',  ja: '案内·優先窓口',        vi: 'Quầy thông tin·Ưu tiên' },
          ] as I18n[]).map((label, i) => (
            <g key={`rd-${i}`}>
              <circle cx={213} cy={207 + i * 20} r={3.5} fill="#2563eb" />
              <text x={219} y={207 + i * 20 + 3} textAnchor="start" fontSize="7.5" fill="#374151" fontWeight="600">
                {tx(label, lang)}
              </text>
            </g>
          ))}
        </svg>

        {/* 범례 그리드 */}
        <div className="grid grid-cols-2 gap-2 px-3 pb-3">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSel(s)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-gusring-surface border border-gusring-border btn-press text-left"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-[11px] font-bold text-gusring-text leading-tight">{tx(s.label, lang)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 바텀시트 — document.body에 Portal로 렌더링해 stacking context 문제 방지 */}
      {sel && createPortal(
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setSel(null)}
          />
          <div
            className="relative w-full sm:max-w-md sm:mx-auto bg-gusring-surface rounded-t-[2rem] max-h-[75vh] flex flex-col animate-slide-up shadow-card-lg"
            onClick={e => e.stopPropagation()}
          >
            {/* 드래그 핸들 */}
            <div className="pt-3 flex justify-center shrink-0">
              <div className="w-10 h-1 rounded-full bg-gusring-border-strong" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gusring-border shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full shrink-0" style={{ background: sel.color }} />
                <h3 className="font-black text-gusring-text text-base">{tx(sel.label, lang)}</h3>
              </div>
              <button
                onClick={() => setSel(null)}
                className="w-8 h-8 rounded-full bg-gusring-bg flex items-center justify-center btn-press"
              >
                <X size={15} className="text-gusring-text-sub" />
              </button>
            </div>

            {/* 창구 목록 */}
            <div className="overflow-y-auto px-4 py-3 space-y-2">
              {sel.windows.map((w, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start p-3 rounded-2xl bg-gusring-bg border border-gusring-border"
                >
                  {w.num && (
                    <div
                      className="shrink-0 min-w-[2.4rem] h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black px-1.5"
                      style={{ background: sel.color }}
                    >
                      {w.num}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="font-bold text-[13px] text-gusring-text leading-snug">{tx(w.title, lang)}</p>
                    {w.desc && tx(w.desc, lang) && (
                      <p className="text-[11px] text-gusring-text-hint mt-0.5 leading-relaxed">{tx(w.desc, lang)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="safe-bottom shrink-0" />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default OfficeMap;
