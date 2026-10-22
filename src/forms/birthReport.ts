import { Box, ChoiceOption, FieldDef, FormDef, L, Part } from './types';

// ─────────────────────────────────────────────────────────────
// 출생신고서 [양식 제1호] — 가족관계등록예규 서식
// 좌표는 public/forms/birth_ko.png (1190×1682) 기준.
// 안내 문구는 서식 뒷면 「작성방법」을 바탕으로 작성.
// ※ 외국인 이름 한글 표기 기준은 구청 확인 필요 (TODO)
// ─────────────────────────────────────────────────────────────

const ROW = 39; // 한 줄 높이

const surnamePart = (box: Box): Part => ({
  key: 'surname',
  box,
  hangul: true,
  label: { ko: '성', en: 'Surname', zh: '姓', ja: '姓', vi: 'Họ' },
  placeholder: '예) 김',
});

const givenPart = (box: Box): Part => ({
  key: 'given',
  box,
  hangul: true,
  label: { ko: '이름', en: 'Given name', zh: '名', ja: '名', vi: 'Tên' },
  placeholder: '예) 하늘',
});

const hanjaPart = (key: string, box: Box, label: L): Part => ({ key, box, label, placeholder: '예) 金' });

const idLabel = (who: L): L => ({
  ko: `${who.ko} 주민등록번호 / 외국인등록번호`,
  en: `${who.en}'s resident / alien registration no.`,
  zh: `${who.zh}居民登录号 / 外国人登录号`,
  ja: `${who.ja}の住民登録番号／外国人登録番号`,
  vi: `Số đăng ký cư trú / người nước ngoài của ${who.vi}`,
});

const ID_HELP: L = {
  ko: '한국인은 주민등록번호, 외국인은 외국인등록번호(외국인등록증 앞면 13자리)를 적어요. 없으면 국내거소신고번호나 생년월일을 적어요.',
  en: 'Koreans: resident registration number. Foreign nationals: alien registration number (13 digits on the front of the residence card). If you have neither, write your domestic residence report number or date of birth.',
  zh: '韩国人填写居民登录号，外国人填写外国人登录号（外国人登录证正面13位）。若都没有，填写国内居所申报号或出生日期。',
  ja: '韓国人は住民登録番号、外国人は外国人登録番号（外国人登録証表面の13桁）を書きます。ない場合は国内居所申告番号または生年月日を書きます。',
  vi: 'Người Hàn: số đăng ký cư trú. Người nước ngoài: số đăng ký người nước ngoài (13 số ở mặt trước thẻ). Nếu không có, ghi số khai báo cư trú trong nước hoặc ngày sinh.',
};

const FATHER: L = { ko: '아버지', en: 'Father', zh: '父亲', ja: '父', vi: 'bố' };
const MOTHER: L = { ko: '어머니', en: 'Mother', zh: '母亲', ja: '母', vi: 'mẹ' };

const EDU_LABELS: { value: string; ko: string; label: L }[] = [
  { value: 'none',   ko: '학력 없음',   label: { ko: '학력 없음',   en: 'No schooling',              zh: '无学历',     ja: '学歴なし', vi: 'Không đi học' } },
  { value: 'elem',   ko: '초등학교',    label: { ko: '초등학교',    en: 'Elementary school',         zh: '小学',       ja: '小学校',   vi: 'Tiểu học' } },
  { value: 'middle', ko: '중학교',      label: { ko: '중학교',      en: 'Middle school',             zh: '初中',       ja: '中学校',   vi: 'Trung học cơ sở' } },
  { value: 'high',   ko: '고등학교',    label: { ko: '고등학교',    en: 'High school',               zh: '高中',       ja: '高校',     vi: 'Trung học phổ thông' } },
  { value: 'univ',   ko: '대학(교)',    label: { ko: '대학(교)',    en: 'College / University',      zh: '大学',       ja: '大学',     vi: 'Cao đẳng / Đại học' } },
  { value: 'grad',   ko: '대학원 이상', label: { ko: '대학원 이상', en: 'Graduate school or higher', zh: '研究生及以上', ja: '大学院以上', vi: 'Sau đại học' } },
];
const EDU_X = [318, 448, 570, 672, 794, 911];
const eduOptions = (y: number): ChoiceOption[] =>
  EDU_LABELS.map((o, i) => ({ ...o, mark: { x: EDU_X[i], y } }));

const EDU_HELP: L = {
  ko: '통계청 조사 항목이에요. 졸업한 학교 중 가장 높은 단계를 골라요. 다니는 중이거나 중퇴했다면 그 전 단계를 골라요. (예: 대학교 3학년 재학 → 고등학교)',
  en: "This is for Statistics Korea's survey. Choose the highest level you graduated from. If still enrolled or you dropped out, choose the level below (e.g., 3rd-year university student → high school).",
  zh: '这是统计厅的调查项目。请选择已毕业的最高学历。在读或肄业则选择前一阶段（例：大学三年级在读 → 高中）。',
  ja: '統計庁の調査項目です。卒業した学校のうち最も高い段階を選びます。在学中・中退の場合はその前の段階を選びます（例：大学3年在学 → 高校）。',
  vi: 'Đây là mục khảo sát của Cục Thống kê. Chọn bậc học cao nhất đã tốt nghiệp. Nếu đang học hoặc bỏ dở, chọn bậc trước đó (VD: đang học năm 3 đại học → trung học phổ thông).',
};

const ORIGIN_HELP: L = {
  ko: '외국인이면 국적(나라 이름)을 적어요. 한국인이면 가족관계등록부의 등록기준지(옛 본적) 주소를 적어요.',
  en: 'For a foreign national, the nationality (country) goes here. For a Korean national, write the registration base address (formerly "bonjeok") from the family relation register.',
  zh: '外国人填写国籍（国家名称）。韩国人填写家族关系登记簿上的登记基准地（原本籍）地址。',
  ja: '外国人の場合は国籍（国名）を書きます。韓国人の場合は家族関係登録簿の登録基準地（旧本籍）の住所を書きます。',
  vi: 'Nếu là người nước ngoài, ghi quốc tịch (tên nước). Nếu là người Hàn, ghi địa chỉ nơi đăng ký gốc (bản quán cũ) trong sổ đăng ký quan hệ gia đình.',
};

const ADDRESS_PLACEHOLDER = '예) 서울시 금천구 시흥대로73길 70';

const copyName = (field: string, who: L): FieldDef['copyFrom'] => [
  {
    field,
    label: { ko: `${who.ko} 이름 가져오기`, en: `Use ${who.en.toLowerCase()}'s name`, zh: `使用${who.zh}姓名`, ja: `${who.ja}の氏名を使う`, vi: `Dùng tên của ${who.vi}` },
    map: { name: 'name' },
  },
];

const parentNameField = (id: string, who: L, y: number, required: boolean): FieldDef => ({
  id,
  section: 'parents',
  required,
  koLabel: `② ${who === FATHER ? '부' : '모'} 성명 (한자)`,
  label: { ko: `${who.ko} 이름`, en: `${who.en}'s name`, zh: `${who.zh}姓名`, ja: `${who.ja}の氏名`, vi: `Tên của ${who.vi}` },
  help: {
    ko: `${who.ko} 이름을 한글로 적어요. 외국인이면 여권·외국인등록증의 이름을 한글로 옮겨 적어요. 한자 이름이 있으면 한자 칸에도 적어요.` +
      (who === FATHER ? ' 혼인외 출생자를 어머니가 신고하는 경우에는 비워 둬요.' : ''),
    en: `Write the ${who.en.toLowerCase()}'s name in Korean letters (Hangul). For a foreign national, transcribe the name on the passport / residence card into Hangul. If there is a name in Chinese characters, add it too.` +
      (who === FATHER ? ' Leave blank if the mother is reporting a child born outside marriage.' : ''),
    zh: `用韩文填写${who.zh}姓名。外国人请将护照/外国人登录证上的姓名按发音写成韩文。如有汉字姓名，也请填写。` +
      (who === FATHER ? '若由母亲申报非婚生子女，则留空。' : ''),
    ja: `${who.ja}の氏名をハングルで書きます。外国人の場合、パスポート・外国人登録証の氏名をハングル表記で書きます。漢字の氏名があればそれも書きます。` +
      (who === FATHER ? '婚姻外の子を母が届け出る場合は空欄にします。' : ''),
    vi: `Ghi tên của ${who.vi} bằng chữ Hàn (Hangul). Nếu là người nước ngoài, phiên âm tên trên hộ chiếu / thẻ người nước ngoài sang Hangul. Nếu có tên chữ Hán, ghi thêm.` +
      (who === FATHER ? ' Để trống nếu người mẹ khai sinh cho con ngoài hôn nhân.' : ''),
  },
  area: { x: 289, y, w: 288, h: ROW },
  input: {
    kind: 'text',
    parts: [
      { key: 'name', box: { x: 306, y: y + 3, w: 86, h: 33, align: 'center' }, hangul: true, label: { ko: '이름 (한글)', en: 'Name (Hangul)', zh: '姓名（韩文）', ja: '氏名（ハングル）', vi: 'Tên (Hangul)' }, placeholder: '예) 응우옌반안' },
      hanjaPart('hanja', { x: 446, y: y + 3, w: 118, h: 33, align: 'center' }, { ko: '한자 (있으면)', en: 'Chinese characters (if any)', zh: '汉字（如有）', ja: '漢字（あれば）', vi: 'Chữ Hán (nếu có)' }),
    ],
  },
});

const parentIdField = (id: string, who: L, y: number, required: boolean): FieldDef => ({
  id,
  section: 'parents',
  required,
  koLabel: `② ${who === FATHER ? '부' : '모'} 주민등록번호`,
  label: idLabel(who),
  help: ID_HELP,
  area: { x: 896, y, w: 151, h: ROW },
  badge: 'margin',
  input: {
    kind: 'idnum',
    front: { x: 900, y: y + 3, w: 66, h: 33, align: 'center' },
    back: { x: 978, y: y + 3, w: 67, h: 33, align: 'center' },
  },
});

const parentOriginField = (id: string, who: L, y: number, required: boolean): FieldDef => ({
  id,
  section: 'parents',
  required,
  koLabel: `② ${who === FATHER ? '부' : '모'}의 등록기준지`,
  label: { ko: `${who.ko} 국적 (등록기준지)`, en: `${who.en}'s nationality (registration base)`, zh: `${who.zh}国籍（登记基准地）`, ja: `${who.ja}の国籍（登録基準地）`, vi: `Quốc tịch của ${who.vi} (nơi đăng ký gốc)` },
  help: ORIGIN_HELP,
  area: { x: 381, y, w: 666, h: ROW },
  input: { kind: 'country', box: { x: 420, y: y + 3, w: 610, h: 33, align: 'center' }, allowKorea: true },
});

const parentEduField = (id: string, who: L, y: number, markY: number): FieldDef => ({
  id,
  section: 'survey',
  koLabel: `㉮ 최종졸업학교 (${who === FATHER ? '부' : '모'})`,
  label: { ko: `${who.ko} 최종 학력`, en: `${who.en}'s highest education`, zh: `${who.zh}最高学历`, ja: `${who.ja}の最終学歴`, vi: `Học vấn cao nhất của ${who.vi}` },
  help: EDU_HELP,
  area: { x: 296, y, w: 749, h: 48 },
  badge: 'margin',
  input: { kind: 'choice', mark: 'circle', options: eduOptions(markY) },
});

const reporterCopyId: FieldDef['copyFrom'] = [
  { field: 'fatherId', label: { ko: '아버지 번호 가져오기', en: "Use father's number", zh: '使用父亲号码', ja: '父の番号を使う', vi: 'Dùng số của bố' }, map: { front: 'front', back: 'back' } },
  { field: 'motherId', label: { ko: '어머니 번호 가져오기', en: "Use mother's number", zh: '使用母亲号码', ja: '母の番号を使う', vi: 'Dùng số của mẹ' }, map: { front: 'front', back: 'back' } },
];

const fields: FieldDef[] = [
  // ── 신고일 ───────────────────────────────────────────────
  {
    id: 'reportDate',
    section: 'meta',
    required: true,
    koLabel: '신고일 ( 년 월 일)',
    label: { ko: '신고하는 날짜', en: 'Date of report', zh: '申报日期', ja: '届出日', vi: 'Ngày khai báo' },
    help: {
      ko: '이 신고서를 제출하는 날짜예요. 보통 오늘 날짜를 적어요.',
      en: "The date you submit this report. Usually today's date.",
      zh: '提交本申报书的日期，通常填写今天的日期。',
      ja: 'この届出を提出する日付です。通常は今日の日付を書きます。',
      vi: 'Ngày bạn nộp tờ khai này. Thường là ngày hôm nay.',
    },
    area: { x: 147, y: 153, w: 396, h: 34 },
    input: {
      kind: 'date',
      boxes: {
        y: { x: 208, y: 156, w: 74, h: 30, align: 'right' },
        m: { x: 306, y: 156, w: 66, h: 30, align: 'right' },
        d: { x: 396, y: 156, w: 66, h: 30, align: 'right' },
      },
    },
  },

  // ── ① 출생자 ─────────────────────────────────────────────
  {
    id: 'childNameKo',
    section: 'child',
    required: true,
    koLabel: '① 출생자 성명 (한글)',
    label: { ko: '아기 이름 (한글)', en: "Baby's name (in Korean)", zh: '婴儿姓名（韩文）', ja: '子の氏名（ハングル）', vi: 'Tên của bé (bằng tiếng Hàn)' },
    help: {
      ko: '태어난 아이의 이름을 한글로 적어요. 성과 이름을 나눠서 입력해 주세요.',
      en: "Write the baby's name in Korean letters (Hangul). Enter the surname and the given name separately.",
      zh: '请用韩文填写孩子的姓名，姓和名分开输入。',
      ja: '生まれた子の氏名をハングルで書きます。姓と名を分けて入力してください。',
      vi: 'Viết tên của bé bằng chữ Hàn (Hangul). Nhập họ và tên riêng.',
    },
    area: { x: 314, y: 189, w: 231, h: 70 },
    input: {
      kind: 'text',
      parts: [
        surnamePart({ x: 352, y: 205, w: 42, h: 40, align: 'center' }),
        givenPart({ x: 446, y: 205, w: 97, h: 40, align: 'center' }),
      ],
    },
  },
  {
    id: 'childNameHanja',
    section: 'child',
    koLabel: '① 출생자 성명 (한자)',
    label: { ko: '아기 이름 (한자)', en: "Baby's name (Chinese characters)", zh: '婴儿姓名（汉字）', ja: '子の氏名（漢字）', vi: 'Tên của bé (chữ Hán)' },
    help: {
      ko: '한자 이름이 있을 때만 적어요. 없으면 비워 두세요. 대법원이 정한 인명용 한자만 쓸 수 있고, 이름은 5자를 넘을 수 없어요(성 제외).',
      en: 'Only if the baby has a name in Chinese characters; otherwise leave it blank. Only characters approved for names by the Supreme Court may be used, up to 5 characters (not counting the surname).',
      zh: '仅在有汉字姓名时填写，没有可留空。只能使用大法院规定的人名用汉字，名字不超过5个字（不含姓）。',
      ja: '漢字の名前がある場合のみ記入し、なければ空欄にします。大法院が定める人名用漢字のみ使用でき、名は5文字以内（姓を除く）です。',
      vi: 'Chỉ điền nếu bé có tên bằng chữ Hán; nếu không thì để trống. Chỉ được dùng chữ Hán dùng cho tên theo quy định của Tòa án Tối cao, tối đa 5 chữ (không tính họ).',
    },
    area: { x: 314, y: 259, w: 231, h: 71 },
    input: {
      kind: 'text',
      parts: [
        hanjaPart('surname', { x: 352, y: 275, w: 42, h: 40, align: 'center' }, { ko: '성 (한자)', en: 'Surname', zh: '姓', ja: '姓', vi: 'Họ' }),
        hanjaPart('given', { x: 446, y: 275, w: 97, h: 40, align: 'center' }, { ko: '이름 (한자)', en: 'Given name', zh: '名', ja: '名', vi: 'Tên' }),
      ],
    },
  },
  {
    id: 'sex',
    section: 'child',
    required: true,
    koLabel: '① 성별',
    label: { ko: '성별', en: 'Sex', zh: '性别', ja: '性別', vi: 'Giới tính' },
    help: {
      ko: '아기의 성별을 골라요.',
      en: "Choose the baby's sex.",
      zh: '选择孩子的性别。',
      ja: '子の性別を選びます。',
      vi: 'Chọn giới tính của bé.',
    },
    area: { x: 792, y: 189, w: 54, h: 141 },
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        { value: 'M', ko: '남', label: { ko: '남', en: 'Male', zh: '男', ja: '男', vi: 'Nam' }, mark: { x: 809, y: 241 } },
        { value: 'F', ko: '여', label: { ko: '여', en: 'Female', zh: '女', ja: '女', vi: 'Nữ' }, mark: { x: 809, y: 277 } },
      ],
    },
  },
  {
    id: 'marital',
    section: 'child',
    required: true,
    koLabel: '① 혼인중의 출생자 / 혼인외의 출생자',
    label: { ko: '부모의 혼인 여부', en: "Parents' marital status", zh: '父母婚姻状况', ja: '父母の婚姻状況', vi: 'Tình trạng hôn nhân của bố mẹ' },
    help: {
      ko: '아기가 태어날 때 부모가 법적으로 혼인신고가 된 부부였는지 골라요.',
      en: 'Choose whether the parents were legally married (marriage registered) when the baby was born.',
      zh: '选择孩子出生时父母是否已依法登记结婚。',
      ja: '子の出生時、父母が法律上婚姻届を出した夫婦だったかを選びます。',
      vi: 'Chọn xem bố mẹ đã đăng ký kết hôn hợp pháp khi bé chào đời hay chưa.',
    },
    area: { x: 846, y: 189, w: 201, h: 141 },
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        { value: 'in', ko: '혼인중의 출생자', label: { ko: '혼인중의 출생자', en: 'Born to married parents', zh: '婚生子女', ja: '婚姻中の出生子（嫡出子）', vi: 'Con sinh ra trong thời kỳ hôn nhân' }, mark: { x: 875, y: 241 } },
        { value: 'out', ko: '혼인외의 출생자', label: { ko: '혼인외의 출생자', en: 'Born to unmarried parents', zh: '非婚生子女', ja: '婚姻外の出生子（嫡出でない子）', vi: 'Con sinh ra ngoài hôn nhân' }, mark: { x: 875, y: 277 } },
      ],
    },
  },
  {
    id: 'birthDateTime',
    section: 'child',
    required: true,
    koLabel: '① 출생일시',
    label: { ko: '태어난 날짜와 시간', en: 'Date and time of birth', zh: '出生日期和时间', ja: '出生日時', vi: 'Ngày giờ sinh' },
    help: {
      ko: '24시간제로 적어요. (예: 오후 2시 30분 → 14시 30분) 외국에서 태어났다면 현지 시각을 적어요.',
      en: 'Use 24-hour time (e.g., 2:30 PM → 14:30). If the baby was born abroad, use the local time there.',
      zh: '使用24小时制（例：下午2点30分 → 14时30分）。如在国外出生，填写当地时间。',
      ja: '24時間制で書きます（例：午後2時30分 → 14時30分）。外国で生まれた場合は現地時刻を書きます。',
      vi: 'Ghi theo giờ 24 tiếng (VD: 2 giờ 30 chiều → 14 giờ 30). Nếu sinh ở nước ngoài, ghi giờ địa phương nơi sinh.',
    },
    area: { x: 314, y: 330, w: 733, h: ROW },
    input: {
      kind: 'datetime',
      boxes: {
        y: { x: 330, y: 333, w: 75, h: 33, align: 'right' },
        m: { x: 428, y: 333, w: 48, h: 33, align: 'right' },
        d: { x: 498, y: 333, w: 48, h: 33, align: 'right' },
        h: { x: 568, y: 333, w: 48, h: 33, align: 'right' },
        min: { x: 638, y: 333, w: 48, h: 33, align: 'right' },
      },
    },
  },
  {
    id: 'birthPlace',
    section: 'child',
    required: true,
    koLabel: '① 출생장소',
    label: { ko: '태어난 장소', en: 'Place of birth', zh: '出生地点', ja: '出生場所', vi: 'Nơi sinh' },
    help: {
      ko: '장소 종류를 고르고 주소(병원이면 병원 주소)를 한국어로 적어요. 시·구·동 또는 도로명까지만 적어도 돼요.',
      en: 'Choose the type of place and write its address in Korean (the hospital address if born in a hospital). Writing up to the city / district / dong or road name is enough.',
      zh: '选择地点类型，并用韩文填写地址（在医院出生则填医院地址）。写到市·区·洞或道路名即可。',
      ja: '場所の種類を選び、住所（病院なら病院の住所）を韓国語で書きます。市・区・洞または道路名まででも構いません。',
      vi: 'Chọn loại địa điểm và ghi địa chỉ bằng tiếng Hàn (nếu sinh ở bệnh viện thì ghi địa chỉ bệnh viện). Chỉ cần ghi đến thành phố / quận / phường (dong) hoặc tên đường.',
    },
    area: { x: 314, y: 369, w: 733, h: ROW },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        { value: 'home', ko: '자택', label: { ko: '자택', en: 'Home', zh: '自家', ja: '自宅', vi: 'Tại nhà' }, mark: { x: 337, y: 388 } },
        { value: 'hospital', ko: '병원', label: { ko: '병원', en: 'Hospital', zh: '医院', ja: '病院', vi: 'Bệnh viện' }, mark: { x: 406, y: 388 } },
        { value: 'other', ko: '기타', label: { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, mark: { x: 476, y: 388 } },
      ],
      extra: {
        key: 'place',
        box: { x: 545, y: 372, w: 498, h: 33, align: 'center' },
        korean: true,
        label: { ko: '장소 주소', en: 'Address of the place', zh: '地点地址', ja: '場所の住所', vi: 'Địa chỉ nơi sinh' },
        placeholder: '예) 서울시 금천구 시흥대로13길 7',
      },
    },
  },
  {
    id: 'childAddress',
    section: 'child',
    required: true,
    koLabel: '① 주소',
    label: { ko: '아기가 살 주소', en: "Baby's address", zh: '婴儿住址', ja: '子の住所', vi: 'Địa chỉ của bé' },
    help: {
      ko: '아기가 살게 될 집 주소를 한국어로 적어요. 보통 부모님과 함께 사는 주소예요.',
      en: 'Write the address where the baby will live, in Korean. Usually the home the baby shares with the parents.',
      zh: '用韩文填写孩子将居住的地址，通常是与父母同住的地址。',
      ja: '子が住む住所を韓国語で書きます。通常は父母と一緒に住む住所です。',
      vi: 'Ghi địa chỉ nơi bé sẽ sống bằng tiếng Hàn. Thường là nhà bé sống cùng bố mẹ.',
    },
    area: { x: 269, y: 447, w: 446, h: 61 },
    input: {
      kind: 'text',
      parts: [{ key: 'address', box: { x: 302, y: 455, w: 408, h: 45, align: 'center' }, korean: true, placeholder: ADDRESS_PLACEHOLDER }],
    },
  },
  {
    id: 'householder',
    section: 'child',
    koLabel: '① 세대주 및 관계',
    label: { ko: '세대주와 아기의 관계', en: 'Head of household & relationship', zh: '户主及与婴儿的关系', ja: '世帯主及び続柄', vi: 'Chủ hộ & quan hệ với bé' },
    help: {
      ko: '그 주소의 세대주 이름과, 세대주가 볼 때 아기가 누구인지 적어요. 예) 홍길동 의 자(아들)',
      en: 'Write the name of the head of household at that address, and who the baby is to them. e.g., 홍길동 의 자 (son)',
      zh: '填写该地址户主的姓名，以及孩子与户主的关系。例：홍길동 의 자（儿子）',
      ja: 'その住所の世帯主の氏名と、世帯主から見た子の続柄を書きます。例）홍길동 의 자（息子）',
      vi: 'Ghi tên chủ hộ tại địa chỉ đó và bé là ai đối với chủ hộ. VD: 홍길동 의 자 (con trai)',
    },
    area: { x: 868, y: 447, w: 179, h: 61 },
    badge: 'margin',
    input: {
      kind: 'text',
      parts: [
        { key: 'name', box: { x: 872, y: 457, w: 76, h: 40, align: 'center' }, hangul: true, label: { ko: '세대주 이름 (한글)', en: 'Head of household (Hangul)', zh: '户主姓名（韩文）', ja: '世帯主の氏名（ハングル）', vi: 'Tên chủ hộ (Hangul)' }, placeholder: '예) 홍길동' },
        {
          key: 'relation',
          box: { x: 968, y: 457, w: 76, h: 40, align: 'center' },
          label: { ko: '관계', en: 'Relationship', zh: '关系', ja: '続柄', vi: 'Quan hệ' },
          options: [
            { value: '자', label: { ko: '자 (아들)', en: 'Son (자)', zh: '儿子 (자)', ja: '息子 (자)', vi: 'Con trai (자)' } },
            { value: '녀', label: { ko: '녀 (딸)', en: 'Daughter (녀)', zh: '女儿 (녀)', ja: '娘 (녀)', vi: 'Con gái (녀)' } },
            { value: '손자', label: { ko: '손자', en: 'Grandson (손자)', zh: '孙子 (손자)', ja: '孫・男 (손자)', vi: 'Cháu trai (손자)' } },
            { value: '손녀', label: { ko: '손녀', en: 'Granddaughter (손녀)', zh: '孙女 (손녀)', ja: '孫・女 (손녀)', vi: 'Cháu gái (손녀)' } },
          ],
        },
      ],
    },
    copyFrom: copyName('fatherName', FATHER)!.concat(copyName('motherName', MOTHER)!),
  },
  {
    id: 'dualNationality',
    section: 'child',
    koLabel: '① 자녀가 복수국적자인 경우 그 사실 및 취득한 외국 국적',
    label: { ko: '아기의 다른 국적', en: "Baby's other nationality", zh: '婴儿的其他国籍', ja: '子のその他の国籍', vi: 'Quốc tịch khác của bé' },
    help: {
      ko: '아기가 한국 국적 외에 다른 나라 국적도 가졌다면 그 나라를 골라요. 없으면 비워 두세요. 증명 서류를 함께 내야 해요.',
      en: "If the baby also holds another country's nationality besides Korean, choose that country. Otherwise leave it blank. A supporting document is required.",
      zh: '如果孩子除韩国国籍外还拥有其他国籍，请选择该国家；没有则留空。需附上证明材料。',
      ja: '子が韓国籍のほかに他国の国籍も持つ場合、その国を選びます。なければ空欄にします。証明書類の添付が必要です。',
      vi: 'Nếu ngoài quốc tịch Hàn Quốc bé còn có quốc tịch nước khác, hãy chọn nước đó. Nếu không thì để trống. Cần nộp kèm giấy tờ chứng minh.',
    },
    area: { x: 758, y: 508, w: 289, h: ROW },
    input: { kind: 'country', box: { x: 765, y: 511, w: 276, h: 33, align: 'center' } },
  },

  // ── ② 부모 ───────────────────────────────────────────────
  parentNameField('fatherName', FATHER, 547, true),
  parentIdField('fatherId', FATHER, 547, true),
  parentNameField('motherName', MOTHER, 586, true),
  parentIdField('motherId', MOTHER, 586, true),
  parentOriginField('fatherOrigin', FATHER, 625, true),
  parentOriginField('motherOrigin', MOTHER, 664, true),
  {
    id: 'surnameAgreement',
    section: 'parents',
    koLabel: '② 혼인신고시 자녀의 성·본을 모의 성·본으로 하는 협의서를 제출하였습니까?',
    label: { ko: '어머니 성을 따르는 협의서', en: "Agreement to use the mother's surname", zh: '随母姓协议书', ja: '母の姓・本に従う協議書', vi: 'Thỏa thuận theo họ mẹ' },
    help: {
      ko: '혼인신고 때 "자녀가 어머니의 성과 본을 따른다"는 협의서를 냈는지 골라요. 혼인신고 때 낸 서류를 확인해 보세요.',
      en: "Choose whether, when you registered your marriage, you submitted an agreement that your children will take the mother's surname and family origin (bon). Check the documents from your marriage registration.",
      zh: '选择办理结婚登记时，是否提交了“子女随母亲姓氏和本贯”的协议书。请查看结婚登记时提交的材料。',
      ja: '婚姻届の際、「子が母の姓・本に従う」という協議書を提出したかを選びます。婚姻届の際の書類を確認してください。',
      vi: 'Chọn xem khi đăng ký kết hôn, bạn có nộp bản thỏa thuận "con theo họ và bản quán của mẹ" hay không. Hãy kiểm tra giấy tờ đã nộp khi đăng ký kết hôn.',
    },
    area: { x: 830, y: 703, w: 217, h: 38 },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'check',
      options: [
        { value: 'yes', ko: '예', label: { ko: '예', en: 'Yes', zh: '是', ja: 'はい', vi: 'Có' }, mark: { x: 856, y: 722 } },
        { value: 'no', ko: '아니요', label: { ko: '아니요', en: 'No', zh: '否', ja: 'いいえ', vi: 'Không' }, mark: { x: 984, y: 722 } },
      ],
    },
  },

  // ── ④ 기타사항 ───────────────────────────────────────────
  {
    id: 'otherNotes',
    section: 'etc',
    koLabel: '④ 기타사항',
    label: { ko: '기타 사항', en: 'Other notes', zh: '其他事项', ja: 'その他事項', vi: 'Ghi chú khác' },
    help: {
      ko: '특별히 기록해야 할 사항이 있을 때만 한국어로 적어요. 예) 외국에서 출생한 경우 한국 시각으로 바꾼 출생일시, 부모가 신고하지 못하는 이유 등. 잘 모르면 창구에 물어보세요.',
      en: 'Only if something special must be recorded, written in Korean. e.g., for a birth abroad, the birth time converted to Korean time, or why the parents cannot report. Ask at the counter if unsure.',
      zh: '仅在有需特别记录的事项时用韩文填写。例：在国外出生时换算为韩国时间的出生日时、父母无法申报的原因等。不确定时请咨询窗口。',
      ja: '特に記録が必要な事項がある場合のみ韓国語で書きます。例）外国で出生した場合の韓国時刻に換算した出生日時、父母が届け出できない理由など。不明な場合は窓口にお尋ねください。',
      vi: 'Chỉ ghi bằng tiếng Hàn khi có nội dung đặc biệt cần ghi lại, VD: nếu sinh ở nước ngoài thì ghi ngày giờ sinh đã đổi sang giờ Hàn Quốc, lý do bố mẹ không thể khai báo... Hãy hỏi tại quầy nếu chưa rõ.',
    },
    area: { x: 289, y: 855, w: 758, h: 38 },
    input: { kind: 'text', parts: [{ key: 'text', box: { x: 330, y: 858, w: 700, h: 33, align: 'left' }, korean: true }] },
  },

  // ── ⑤ 신고인 ─────────────────────────────────────────────
  {
    id: 'reporterName',
    section: 'reporter',
    required: true,
    koLabel: '⑤ 신고인 성명',
    label: { ko: '신고하는 사람 이름', en: 'Name of the person reporting', zh: '申报人姓名', ja: '届出人の氏名', vi: 'Tên người khai báo' },
    help: {
      ko: '이 신고서를 내는 사람(보통 아버지나 어머니)의 이름을 한글로 적어요. 서명이나 도장은 출력한 종이에 직접 해요.',
      en: 'Name of the person submitting this report (usually the father or mother), in Korean letters. Sign or stamp by hand on the printed paper.',
      zh: '用韩文填写提交本申报书的人（通常是父亲或母亲）的姓名。签名或盖章请在打印出的纸上亲自完成。',
      ja: 'この届出を出す人（通常は父または母）の氏名をハングルで書きます。署名・押印は印刷した紙に直接します。',
      vi: 'Tên người nộp tờ khai này (thường là bố hoặc mẹ) bằng chữ Hàn. Ký tên hoặc đóng dấu trực tiếp trên giấy đã in.',
    },
    area: { x: 289, y: 893, w: 350, h: 37 },
    input: { kind: 'text', parts: [{ key: 'name', box: { x: 320, y: 896, w: 200, h: 31, align: 'center' }, hangul: true, placeholder: '예) 응우옌티란' }] },
    copyFrom: copyName('fatherName', FATHER)!.concat(copyName('motherName', MOTHER)!),
  },
  {
    id: 'reporterId',
    section: 'reporter',
    required: true,
    koLabel: '⑤ 신고인 주민등록번호',
    label: { ko: '신고인 주민등록번호 / 외국인등록번호', en: "Reporter's resident / alien registration no.", zh: '申报人居民登录号 / 外国人登录号', ja: '届出人の住民登録番号／外国人登録番号', vi: 'Số đăng ký cư trú / người nước ngoài của người khai' },
    help: ID_HELP,
    area: { x: 769, y: 893, w: 278, h: 37 },
    input: { kind: 'idnum', front: { x: 790, y: 896, w: 108, h: 31, align: 'center' }, back: { x: 918, y: 896, w: 124, h: 31, align: 'center' } },
    copyFrom: reporterCopyId,
  },
  {
    id: 'reporterQualification',
    section: 'reporter',
    required: true,
    koLabel: '⑤ 자격',
    label: { ko: '신고인과 아기의 관계', en: "Reporter's relationship to the baby", zh: '申报人与婴儿的关系', ja: '届出人の資格', vi: 'Quan hệ của người khai với bé' },
    help: {
      ko: '신고하는 사람이 아기의 누구인지 골라요.',
      en: 'Choose who the reporting person is to the baby.',
      zh: '选择申报人是孩子的什么人。',
      ja: '届出人が子から見て誰にあたるかを選びます。',
      vi: 'Chọn người khai báo là ai đối với bé.',
    },
    area: { x: 289, y: 930, w: 758, h: ROW },
    badge: 'margin',
    input: {
      kind: 'choice',
      mark: 'circle',
      options: [
        { value: 'father', ko: '부', label: { ko: '부 (아버지)', en: 'Father', zh: '父亲', ja: '父', vi: 'Bố' }, mark: { x: 312, y: 950 } },
        { value: 'mother', ko: '모', label: { ko: '모 (어머니)', en: 'Mother', zh: '母亲', ja: '母', vi: 'Mẹ' }, mark: { x: 372, y: 950 } },
        { value: 'relative', ko: '동거친족', label: { ko: '동거친족', en: 'Relative living with the baby', zh: '同住亲属', ja: '同居の親族', vi: 'Người thân sống cùng bé' }, mark: { x: 432, y: 950 } },
        { value: 'other', ko: '기타', label: { ko: '기타', en: 'Other', zh: '其他', ja: 'その他', vi: 'Khác' }, mark: { x: 552, y: 950 } },
      ],
      extra: {
        key: 'detail',
        when: ['other'],
        box: { x: 660, y: 933, w: 240, h: 33, align: 'center' },
        korean: true,
        label: { ko: '자격 (한국어)', en: 'Relationship (in Korean)', zh: '关系（韩文）', ja: '資格（韓国語）', vi: 'Quan hệ (tiếng Hàn)' },
        placeholder: '예) 조산사',
      },
    },
  },
  {
    id: 'reporterAddress',
    section: 'reporter',
    koLabel: '⑤ 주소',
    label: { ko: '신고인 주소', en: "Reporter's address", zh: '申报人地址', ja: '届出人の住所', vi: 'Địa chỉ người khai' },
    help: {
      ko: '신고하는 사람의 주소를 한국어로 적어요.',
      en: "Write the reporting person's address in Korean.",
      zh: '用韩文填写申报人的地址。',
      ja: '届出人の住所を韓国語で書きます。',
      vi: 'Ghi địa chỉ của người khai báo bằng tiếng Hàn.',
    },
    area: { x: 289, y: 969, w: 758, h: 62 },
    input: { kind: 'text', parts: [{ key: 'address', box: { x: 330, y: 977, w: 700, h: 46, align: 'center' }, korean: true, placeholder: ADDRESS_PLACEHOLDER }] },
    copyFrom: [
      { field: 'childAddress', label: { ko: '아기 주소와 같아요', en: "Same as the baby's address", zh: '与婴儿地址相同', ja: '子の住所と同じ', vi: 'Giống địa chỉ của bé' }, map: { address: 'address' } },
    ],
  },
  {
    id: 'reporterPhone',
    section: 'reporter',
    required: true,
    koLabel: '⑤ 전화',
    label: { ko: '전화번호', en: 'Phone number', zh: '电话号码', ja: '電話番号', vi: 'Số điện thoại' },
    help: {
      ko: '연락 가능한 휴대전화 번호를 적어요.',
      en: 'A mobile number where you can be reached.',
      zh: '填写可以联系到的手机号码。',
      ja: '連絡のつく携帯電話番号を書きます。',
      vi: 'Số điện thoại di động có thể liên lạc được.',
    },
    area: { x: 289, y: 1031, w: 256, h: 37 },
    input: { kind: 'text', parts: [{ key: 'phone', box: { x: 320, y: 1034, w: 220, h: 31, align: 'center' }, inputMode: 'tel', placeholder: '010-1234-5678' }] },
  },
  {
    id: 'reporterEmail',
    section: 'reporter',
    koLabel: '⑤ 이메일',
    label: { ko: '이메일', en: 'Email', zh: '电子邮箱', ja: 'メールアドレス', vi: 'Email' },
    help: {
      ko: '선택 사항이에요.',
      en: 'Optional.',
      zh: '选填。',
      ja: '任意です。',
      vi: 'Không bắt buộc.',
    },
    area: { x: 650, y: 1031, w: 397, h: 37 },
    input: { kind: 'text', parts: [{ key: 'email', box: { x: 680, y: 1034, w: 360, h: 31, align: 'center' }, inputMode: 'email', placeholder: 'name@example.com' }] },
  },

  // ── ⑥ 제출인 ─────────────────────────────────────────────
  {
    id: 'submitterName',
    section: 'submitter',
    koLabel: '⑥ 제출인 성명',
    label: { ko: '대신 제출하는 사람 이름', en: 'Name of the person submitting on behalf', zh: '代为提交人姓名', ja: '提出人の氏名', vi: 'Tên người nộp thay' },
    help: {
      ko: '신고인이 아닌 다른 사람이 창구에 서류를 낼 때만 적어요. 신고인이 직접 내면 비워 두세요.',
      en: 'Only if someone other than the reporting person brings this form to the office. Leave blank if the reporter submits it in person.',
      zh: '仅在由申报人以外的人到窗口提交时填写。申报人本人提交则留空。',
      ja: '届出人以外の人が窓口に提出する場合のみ書きます。届出人本人が提出する場合は空欄にします。',
      vi: 'Chỉ ghi khi người khác (không phải người khai) mang tờ khai đến nộp. Để trống nếu người khai tự nộp.',
    },
    area: { x: 366, y: 1068, w: 179, h: 37 },
    input: { kind: 'text', parts: [{ key: 'name', box: { x: 396, y: 1071, w: 145, h: 31, align: 'center' }, hangul: true }] },
  },
  {
    id: 'submitterId',
    section: 'submitter',
    koLabel: '⑥ 제출인 주민등록번호',
    label: { ko: '제출인 주민등록번호 / 외국인등록번호', en: "Submitter's resident / alien registration no.", zh: '代交人居民登录号 / 外国人登录号', ja: '提出人の住民登録番号／外国人登録番号', vi: 'Số đăng ký của người nộp thay' },
    help: ID_HELP,
    area: { x: 707, y: 1068, w: 340, h: 37 },
    input: { kind: 'idnum', front: { x: 740, y: 1071, w: 128, h: 31, align: 'center' }, back: { x: 890, y: 1071, w: 150, h: 31, align: 'center' } },
  },

  // ── 인구동향조사 ─────────────────────────────────────────
  parentEduField('fatherEducation', FATHER, 1340, 1365),
  parentEduField('motherEducation', MOTHER, 1388, 1413),
];

export const birthReport: FormDef = {
  id: 'birth-report',
  title: { ko: '출생신고서', en: 'Birth Report', zh: '出生申报书', ja: '出生届', vi: 'Giấy khai sinh' },
  image: '/forms/birth_ko.png',
  width: 1190,
  height: 1682,
  sections: [
    { id: 'meta',      label: { ko: '신고일',         en: 'Report date',       zh: '申报日期',     ja: '届出日',       vi: 'Ngày khai báo' } },
    { id: 'child',     label: { ko: '① 출생자',       en: '① The baby',        zh: '① 出生者',     ja: '① 出生子',     vi: '① Em bé' } },
    { id: 'parents',   label: { ko: '② 부모',         en: '② Parents',         zh: '② 父母',       ja: '② 父母',       vi: '② Bố mẹ' } },
    { id: 'etc',       label: { ko: '④ 기타사항',     en: '④ Other notes',     zh: '④ 其他事项',   ja: '④ その他事項', vi: '④ Ghi chú khác' } },
    { id: 'reporter',  label: { ko: '⑤ 신고인',       en: '⑤ Person reporting', zh: '⑤ 申报人',    ja: '⑤ 届出人',     vi: '⑤ Người khai báo' } },
    { id: 'submitter', label: { ko: '⑥ 제출인',       en: '⑥ Submitter',       zh: '⑥ 提交人',     ja: '⑥ 提出人',     vi: '⑥ Người nộp thay' } },
    { id: 'survey',    label: { ko: '인구동향조사',   en: 'Population survey', zh: '人口动向调查', ja: '人口動向調査', vi: 'Khảo sát dân số' } },
  ],
  fields,
};
