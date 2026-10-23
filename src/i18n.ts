import { L, Lang } from './forms/types';

export const languages: { id: Lang; label: string; flag: string }[] = [
  { id: 'ko', label: '한국어', flag: '🇰🇷' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'zh', label: '中文', flag: '🇨🇳' },
  { id: 'ja', label: '日本語', flag: '🇯🇵' },
  { id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];

export const tr = (s: L, lang: Lang, vars?: Record<string, string | number>) => {
  let out = s[lang] ?? s.en;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.replace(`{${k}}`, String(v));
  return out;
};

export const UI = {
  // ── 문서 선택 화면 (gusring-web 문구) ──
  welcome:       { ko: '금천구 다국어 민원 가이드', en: 'Geumcheon Multilingual Guide', zh: '衿川多语种指南', ja: '衿川多言語ガイド', vi: 'Hướng dẫn thủ tục hành chính đa ngôn ngữ tại quận Geumcheon' },
  subWelcome:    { ko: '모국어 안내를 보며 행정 서식을 바로 작성해요.', en: 'Fill in administrative forms with guidance in your language.', zh: '在母语指引下直接填写行政表格。', ja: '母国語の案内を見ながら行政書類をその場で作成できます。', vi: 'Điền mẫu đơn hành chính với hướng dẫn bằng tiếng mẹ đẻ.' },
  searchPlaceholder: { ko: '서식 명칭 검색...', en: 'Search forms...', zh: '搜索表格...', ja: '書類検索...', vi: 'Tìm kiếm mẫu đơn...' },
  catAll:        { ko: '전체', en: 'All', zh: '全部', ja: '全て', vi: 'Tất cả' },
  noResult:      { ko: '검색 결과가 없습니다.', en: 'No results found.', zh: '无结果。', ja: '結果がありません。', vi: 'Không có kết quả.' },
  back:          { ko: '뒤로가기', en: 'Back', zh: '返回', ja: '戻る', vi: 'Quay lại' },
  home:          { ko: '언어 선택으로', en: 'Choose language', zh: '选择语言', ja: '言語選択へ', vi: 'Chọn ngôn ngữ' },
  officeMap:     { ko: '통합민원실 지도', en: 'Civil service office map', zh: '综合民愿室地图', ja: '総合民願室マップ', vi: 'Sơ đồ phòng dân sự' },

  // ── 서식 작성 화면 ──
  appName:       { ko: '서식 작성 도우미', en: 'Form Helper', zh: '表格填写助手', ja: '書式記入ヘルパー', vi: 'Trợ lý điền mẫu đơn' },
  prototype:     { ko: '프로토타입', en: 'Prototype', zh: '原型', ja: 'プロトタイプ', vi: 'Bản thử nghiệm' },
  intro: {
    ko: '서식 위 번호를 누르면 모국어 안내와 입력칸이 열려요. 입력한 내용은 한국어 서식에 바로 들어가요.',
    en: 'Tap a number on the form to see an explanation in your language and fill it in. What you enter goes straight onto the Korean form.',
    zh: '点击表格上的编号，即可看到母语说明并填写。输入的内容会直接填入韩文表格。',
    ja: '書式上の番号をタップすると、母国語の案内と入力欄が開きます。入力内容はそのまま韓国語の書式に記入されます。',
    vi: 'Nhấn vào số trên mẫu đơn để xem hướng dẫn bằng tiếng mẹ đẻ và điền thông tin. Nội dung bạn nhập sẽ được điền ngay vào mẫu đơn tiếng Hàn.',
  },
  required:      { ko: '필수', en: 'Required', zh: '必填', ja: '必須', vi: 'Bắt buộc' },
  optional:      { ko: '선택', en: 'Optional', zh: '选填', ja: '任意', vi: 'Không bắt buộc' },
  saveNext:      { ko: '저장하고 다음', en: 'Save & next', zh: '保存并继续', ja: '保存して次へ', vi: 'Lưu & tiếp' },
  save:          { ko: '저장', en: 'Save', zh: '保存', ja: '保存', vi: 'Lưu' },
  prev:          { ko: '이전', en: 'Back', zh: '上一项', ja: '前へ', vi: 'Trước' },
  clear:         { ko: '지우기', en: 'Clear', zh: '清除', ja: '消去', vi: 'Xóa' },
  close:         { ko: '닫기', en: 'Close', zh: '关闭', ja: '閉じる', vi: 'Đóng' },
  hangulWarn:    { ko: '한글로 적어야 서식에 올바르게 들어가요.', en: 'Please write this in Korean letters (Hangul).', zh: '请用韩文书写。', ja: 'ハングルで書いてください。', vi: 'Vui lòng viết bằng chữ Hàn (Hangul).' },
  koreanWarn:    { ko: '한국어로 적어 주세요.', en: 'Please write this in Korean.', zh: '请用韩文填写。', ja: '韓国語で書いてください。', vi: 'Vui lòng viết bằng tiếng Hàn.' },
  today:         { ko: '오늘', en: 'Today', zh: '今天', ja: '今日', vi: 'Hôm nay' },
  date:          { ko: '날짜', en: 'Date', zh: '日期', ja: '日付', vi: 'Ngày' },
  time24:        { ko: '시간 (24시간제)', en: 'Time (24-hour)', zh: '时间（24小时制）', ja: '時刻（24時間制）', vi: 'Giờ (24 giờ)' },
  selectCountry: { ko: '나라를 고르세요', en: 'Select a country', zh: '请选择国家', ja: '国を選んでください', vi: 'Chọn quốc gia' },
  otherCountry:  { ko: '목록에 없어요 (직접 입력)', en: 'Not listed (type it in)', zh: '列表中没有（直接输入）', ja: 'リストにない（直接入力）', vi: 'Không có trong danh sách (tự nhập)' },
  countryNameKo: { ko: '나라 이름 (한국어)', en: 'Country name (in Korean)', zh: '国家名称（韩文）', ja: '国名（韓国語）', vi: 'Tên quốc gia (tiếng Hàn)' },
  originAddress: { ko: '등록기준지 주소', en: 'Registration base address', zh: '登记基准地地址', ja: '登録基準地の住所', vi: 'Địa chỉ nơi đăng ký gốc' },
  writtenAs:     { ko: '서식에는 "{ko}"(으)로 적혀요', en: 'Written on the form as "{ko}"', zh: '表格上将写为“{ko}”', ja: '書式には「{ko}」と記入されます', vi: 'Trên mẫu đơn sẽ ghi là "{ko}"' },
  idFront:       { ko: '앞 6자리', en: 'First 6 digits', zh: '前6位', ja: '前6桁', vi: '6 số đầu' },
  idBack:        { ko: '뒤 7자리', en: 'Last 7 digits', zh: '后7位', ja: '後7桁', vi: '7 số sau' },
  selectPlease:  { ko: '선택하세요', en: 'Select', zh: '请选择', ja: '選択してください', vi: 'Chọn' },
  showGuides:    { ko: '번호 표시', en: 'Show numbers', zh: '显示编号', ja: '番号を表示', vi: 'Hiện số' },
  allFields:     { ko: '전체 항목', en: 'All fields', zh: '全部项目', ja: '全項目', vi: 'Tất cả mục' },
  empty:         { ko: '비어 있음', en: 'Empty', zh: '未填写', ja: '未入力', vi: 'Chưa điền' },
  reset:         { ko: '처음부터', en: 'Start over', zh: '重新开始', ja: '最初から', vi: 'Làm lại' },
  resetConfirm:  { ko: '입력한 내용을 모두 지울까요?', en: 'Clear everything you entered?', zh: '要清除所有输入内容吗？', ja: '入力した内容をすべて消去しますか？', vi: 'Xóa toàn bộ nội dung đã nhập?' },
  finish:        { ko: '완성 서식 보기', en: 'View completed form', zh: '查看完成的表格', ja: '完成した書式を見る', vi: 'Xem mẫu đã hoàn thành' },
  outputTitle:   { ko: '완성된 한국어 서식', en: 'Completed Korean form', zh: '已完成的韩文表格', ja: '完成した韓国語の書式', vi: 'Mẫu đơn tiếng Hàn đã hoàn thành' },
  saveImage:     { ko: '이미지 저장', en: 'Save image', zh: '保存图片', ja: '画像を保存', vi: 'Lưu ảnh' },
  print:         { ko: '인쇄', en: 'Print', zh: '打印', ja: '印刷', vi: 'In' },
  missingRequired: { ko: '아직 비어 있는 필수 항목 {n}개', en: '{n} required field(s) still empty', zh: '还有{n}个必填项未填写', ja: '未入力の必須項目が{n}件あります', vi: 'Còn {n} mục bắt buộc chưa điền' },
  noteSign:      { ko: '서명 또는 도장은 출력한 종이에 직접 해 주세요.', en: 'Sign or stamp the printed form by hand.', zh: '请在打印出的表格上亲自签名或盖章。', ja: '署名または押印は印刷した用紙に直接してください。', vi: 'Hãy ký tên hoặc đóng dấu trực tiếp trên mẫu đã in.' },
  noteCheck:     { ko: '제출하기 전에 창구 직원과 내용을 한 번 확인하세요.', en: 'Check the contents with the counter staff before submitting.', zh: '提交前请与窗口工作人员确认内容。', ja: '提出前に窓口の職員と内容を確認してください。', vi: 'Hãy kiểm tra nội dung với nhân viên tại quầy trước khi nộp.' },
  notePrivacy:   { ko: '입력한 정보는 이 기기에만 저장되고 서버로 보내지 않아요.', en: 'Your information is stored only on this device and is never sent to a server.', zh: '您输入的信息仅保存在本设备上，不会发送到服务器。', ja: '入力した情報はこの端末にのみ保存され、サーバーには送信されません。', vi: 'Thông tin bạn nhập chỉ được lưu trên thiết bị này và không gửi lên máy chủ.' },
  zoomIn:        { ko: '확대', en: 'Zoom in', zh: '放大', ja: '拡大', vi: 'Phóng to' },
  zoomOut:       { ko: '축소', en: 'Zoom out', zh: '缩小', ja: '縮小', vi: 'Thu nhỏ' },
  language:      { ko: '언어', en: 'Language', zh: '语言', ja: '言語', vi: 'Ngôn ngữ' },
} satisfies Record<string, L>;
