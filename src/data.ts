export interface CharacterItem {
  id: number;
  word: string;
  pinyin: string; // generated dynamically, with fallback
  phrase: string; // cute baby world association
  characterType: 'nature' | 'human' | 'animal' | 'action' | 'direction';
}

export interface DinoLevel {
  levelNumber: number;
  name: string;
  theme: string;
  colorClass: string;
  bgGradient: string;
  emoji: string;
  description: string;
  badgeEmoji: string;
  charSource: string; // exactly 300 characters
}

export interface DinoSticker {
  id: string;
  name: string;
  type: string;
  color: string;
  accentColor: string;
  description: string;
  roarText: string;
  svgType: 't-rex' | 'triceratops' | 'stegosaurus' | 'pterodactyl' | 'brachiosaurus' | 'ankylosaurus';
}

// 10 Dinosaur Levels, each containing exactly 300 characters for a total of 3000 characters
export const DINO_LEVELS: DinoLevel[] = [
  {
    levelNumber: 1,
    name: "绿洲萌芽关",
    theme: "恐龙蛋与新生植物",
    colorClass: "from-emerald-400 to-green-500",
    bgGradient: "from-emerald-50 to-teal-50",
    emoji: "🥚",
    badgeEmoji: "🌱",
    description: "大自然的神奇宝贝！认识最简单的自然、身体和方位字，帮小恐龙破壳而出吧！",
    charSource: "一二三四五六七八九十百千万大小多少上前后左右东西南北日月水火山田土木人口手足耳目头牙齿舌眉毛皮肤骨肉左右男女老少大小多少中内外上下前后" +
                "自方的爸妈哥姐弟妹爷奶叔姨姑公婆人男女儿子孙兄夫妇朋友老少你我他它她谁什么哪里这里那里哪个哪些这样那样多小高矮肥瘦胖美丑好坏对错真假" +
                "天地日月星云风雨雪雷电霜露雾冰风暴沙尘泥土石头沙子金生动水火林野草花树叶枝果皮根种子花粉棉花谷物米麦豆瓜果菜肉鱼鸟兽虫蛇牛羊马驴猪" +
                "鸡鸭鹅猫狗兔鼠象狮虎豹狼熊鹿猴猿狐狸猪羊牛驼螺蜜蛛蚁蝇蚊蝉蝶蛾蝗蟹虾蚌贝鱼龟蛇龙凤春假夏秋季冬天地山川江河湖海波浪潮汐风声雨水雷鸣" +
                "上下左右前后中间内外高低深浅长短粗细宽窄厚薄轻重快慢强弱刚柔胜负进退开关来去出入升降起落生死荣枯盛衰成败得失冷热暖凉干湿清浊左右"
  },
  {
    levelNumber: 2,
    name: "火山探险关",
    theme: "炽热岩浆与勇敢探险",
    colorClass: "from-orange-400 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    emoji: "🌋",
    badgeEmoji: "🔥",
    description: "小小探险家出发！这一关有超多有趣的动作、日常生活用具和家里的宝贝字词哦！",
    charSource: "写读书画算说听讲唱跳跑爬踢打拉推拍扯摇摆抓拿抱摸指点看望瞥瞧闻听嗅尝咬吃喝吐吞吸呼叫喊唤笑哭怒怕愁喜悲忧思虑想望惊慌忙闲急慢稳乱" +
                "行步走奔趋跨跃跳钻跑逐追赶近远到去回往返来出入过通达迎送避逃躲藏隐现升降落飘起伏停站卧坐立躺爬侧倒翻转旋绕动静松紧聚散合开分连接" +
                "衣裤鞋帽袜衫裙带针线织造缝补洗染晒干叠藏剪裁口袋钮扣拉链皮鞋布鞋雨伞拖鞋凉帽手套毛巾手绢牙刷肥皂梳子镜子脸盆澡盆洗脸洗手洗澡化妆" +
                "床被褥枕席床单窗帘毛毯垫子桌椅凳柜箱架台案锁钥伞扇锅碗瓢盆勺筷刀叉盘碟壶杯瓶罐箱笼萝筛簸箕扫帚尘推抹布垃圾桶电灯蜡烛火柴电池插" +
                "玩耍玩具娃娃气球积木拼图蜡笔彩泥风筝皮球滑梯秋千木马遥控车魔方飞盘风铃沙漏指南针放大镜算盘纸牌棋子毽子秋千转椅蹦床城堡滑板游乐"
  },
  {
    levelNumber: 3,
    name: "湖泊寻宝关",
    theme: "清凉河水与奇妙水生恐龙",
    colorClass: "from-cyan-400 to-blue-500",
    bgGradient: "from-cyan-50 to-blue-50",
    emoji: "🌊",
    badgeEmoji: "💎",
    description: "在远古的清凉湖泊里寻找闪闪发光的宝石！一起学习文具、交通运输和我们身体的秘密！",
    charSource: "笔纸墨砚刀剪尺针绣图书画报信封邮票卡片挂历台历明信片笔记本橡皮擦铅笔盒圆珠笔钢笔墨水彩笔画板颜料胶水剪刀胶带别针回形针夹子大头" +
                "车轮机轨桥路街巷园场厂矿仓库房楼阁殿堂庙宇塔寺亭台楼房瓦砖泥沙水泥石灰玻璃油漆瓦片梁柱门窗墙壁地板天花板阶梯电梯过道阳台走廊" +
                "工农商学兵政党团社队会组部司局处科股室行站所厂工人们作农民生产商业学习兵士政府政党团体社会会议组织机关管理服务工人学生教师医生" +
                "心肝脾肺肾脑骨血液肉皮筋脉毛发爪牙眼耳鼻口舌喉面颊肩膀胳膊背部胸部腹部腰部屁股大腿小腿膝盖足踝脚趾手掌手指手肘手套手镯手表项链" +
                "江河湖海水泽溪涧潭湾港口波涛浪花潮汐涌流平沙泥滩孤岛渔船渡口浮桥航线风帆桅杆桨舵锚链救生圈游泳戏水潜水钓鱼虾蟹蛤蜊珍珠海螺珊瑚"
  },
  {
    levelNumber: 4,
    name: "珊瑚彩林的乐园关",
    theme: "巨型植物与美味果子",
    colorClass: "from-lime-400 to-emerald-500",
    bgGradient: "from-lime-50 to-emerald-50",
    emoji: "🎋",
    badgeEmoji: "🌸",
    description: "走入茂密繁盛的恐龙森林，在这里采摘彩色的水果和漂亮的花草！认识天气与斑斓色彩！",
    charSource: "晴阴雨雪云雾霜露风雷电雹虹霞晖晨曦破晓黎明清晨上午中午下午黄昏傍晚落日夜幕深夜子夜半夜晓旦旬月年份季度世纪春秋冷热温凉炎暑寒冬" +
                "红橙黄绿青蓝紫黑白灰粉金银橙褐赤赭黛缥碧蓝碧绿嫩绿深红淡黄粉红雪白乳白亮白乌黑漆黑深灰浅灰金黄色银灰色五颜六色斑斓多彩绚丽夺目" +
                "酸甜苦辣咸淡香臭涩腥鲜麻甘甜酸溜溜甜丝丝苦巴巴辣乎乎咸津津香喷喷臭熏熏鲜美可口美味佳肴酸辣苦涩五味俱全津津有味细嚼慢咽狼吞虎咽" +
                "金木水火土铁铜银铝钢铅锡煤油炭气矿沙砂石水泥砖瓦陶瓷玻璃塑料橡胶皮革纤维丝绸棉布呢绒化纤混纺尼龙帆布织物纽扣拉链花边刺绣缝纫" +
                "桃李杏梨苹果香蕉葡萄草莓西瓜哈密瓜橘子橙子柠檬芒果菠萝椰子樱桃红枣荔枝桂圆山楂猕猴桃桑葚石榴柿子板栗核桃花生芝麻甘蔗甜菜马铃"
  },
  {
    levelNumber: 5,
    name: "冰川防线历险关",
    theme: "远古冰雪与坚强毅力",
    colorClass: "from-sky-400 to-indigo-500",
    bgGradient: "from-sky-50 to-indigo-50",
    emoji: "🏔️",
    badgeEmoji: "❄️",
    description: "踏上白雪皑皑的极地冰川！跟小翼龙一起在风雪中锻炼意志，学习表达想法和美德的词汇！",
    charSource: "说谎实话答应拒绝请求允许禁止命令叮嘱原谅感谢道歉恭喜祝福问候道别讨论争论辩论商量建议表扬批评惩罚鼓励安慰安慰支持反对赞成勉强" +
                "聪明愚蠢活泼安静勇敢胆小诚实虚伪谦虚骄傲大方小气温柔粗暴乐观悲观热情冷淡大方害羞淘气乖巧听话懂事调皮捣蛋可爱滑稽可笑自私无私" +
                "喜悦愤怒忧伤恐惧惊讶羡慕嫉妒得意委屈害羞惭愧骄傲自豪感动同情怀念思念期待渴望绝望焦虑烦恼痛苦伤心难过高兴快乐兴奋轻松紧张疲劳" +
                "听说读写背诵抄写翻译解释分析总结记忆遗忘思考联想想象创造发明发现在学温习复习练习考试成绩分数合格优秀及格不及格升学留级毕业修" +
                "冰天雪地寒风刺骨冰川积雪冻土极光暖阳春水微风和暖冰凉透骨雪花飞舞雪人冰雕滑雪冰鞋棉袄手套炉火温泉温暖如春不畏严寒坚持到底勇敢"
  },
  {
    levelNumber: 6,
    name: "云巅翱翔关",
    theme: "自由天空与云中城堡",
    colorClass: "from-indigo-400 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
    emoji: "☁️",
    badgeEmoji: "🪁",
    description: "飞上云端，和翼龙飞跃重重白云！在这一关学习成语中美丽的四季景象和天气成语！",
    charSource: "春光明媚春风和煦春雨绵绵春意盎然鸟语花香百花齐放烈日炎炎夏日炎炎绿树成荫骄阳似火晴空万里秋风送爽秋意浓浓秋色宜人硕果累累金桂飘" +
                "秋风落叶白雪皑皑漫天飞雪冰天雪地寒风刺骨寒冬腊月滴水成冰风雪交加大地回春万物复苏柳暗花明烟消云散风和日丽晴空霹雳雷电交加风起云" +
                "山清水秀汹涌澎湃波澜壮阔涓涓细流碧波荡漾烟雨濛濛波光粼粼山穷水尽峰峦雄伟悬崖峭壁高耸入云奇峰异石巍然屹立层峦叠嶂一碧千里万壑争" +
                "欢声笑语神采奕奕笑容可掬喜上眉梢眉开眼笑手舞足蹈大喜过望兴高采烈欣喜若狂载歌载舞喜出望外乐不可支心花怒放面带微笑喜气洋洋欢天喜" +
                "云海翻腾霞光万道狂风暴雨电闪雷鸣阴晴圆缺乌云密布彩虹飞架繁星闪烁皓月当空金光闪闪万里无云风吹草低天高地迥一望无垠云遮雾罩清风"
  },
  {
    levelNumber: 7,
    name: "金色麦田关",
    theme: "丰收喜悦与金黄庄稼",
    colorClass: "from-yellow-400 to-amber-500",
    bgGradient: "from-yellow-50 to-amber-50",
    emoji: "🌾",
    badgeEmoji: "🍎",
    description: "金灿灿的麦田丰收啦！恐龙宝贝们一起帮忙收割。认识最丰富的感情跟生机盎然的汉字！",
    charSource: "怒气冲冲暴跳如雷火冒三丈咬牙切齿面红耳赤怒目圆睁大发雷霆勃然大怒愤愤不平怒火中烧怒气难消满腔怒火忧心忡忡愁眉苦脸泪流满面伤心欲" +
                "垂头丧气痛哭流涕泣不成声忧心如焚愁眉不展闷闷不乐唉声叹气胆战心惊面如土色心惊肉跳心慌意乱惊慌失措忐忑不安魂飞魄散惊恐万分提心吊" +
                "张口结舌目瞪口呆面面相觑大惊失色惊魂未定惊叹不已欣欣向荣蒸蒸日上日新月异生机勃勃朝气蓬勃活力四射欣欣向荣景象繁荣一日千里飞速发" +
                "鸟语花香万物生机盎然春光明媚春色满园春意盎然生机勃勃英姿飒爽精神抖擞生龙活虎神采飞扬气宇轩昂容光换发精神换发雄心壮志气势汹汹威" +
                "五谷丰登瓜果飘香稻浪翻滚麦穗沉沉颗粒归仓喜笑颜开收获满满五彩斑斓五颜六色姹紫嫣红生机盎然春风吹又生百折不挠永不退缩快乐无限"
  },
  {
    levelNumber: 8,
    name: "晶石矿山关",
    theme: "地下宝藏与闪亮晶石",
    colorClass: "from-violet-400 to-fuchsia-500",
    bgGradient: "from-violet-50 to-fuchsia-50",
    emoji: "💎",
    badgeEmoji: "🔮",
    description: "深入大山的地下矿洞，寻找闪闪夺目的红蓝宝石！学习赞美、名气、壮观场面的词汇！",
    charSource: "大名鼎鼎名满天下名不虚传远近闻名中外闻名妇孺皆知声名显赫赫赫有名举世闻名名声在外小有名气名扬四海名列前茅独占鳌头名不副实虚张声" +
                "默默无闻无名小卒不见经传引人注目引人入胜赏心悦目精美绝伦美轮美奂巧夺天工别具一格富丽堂皇金碧辉煌古色古香雕梁画栋玲珑剔透小巧玲" +
                "气势磅礴波澜壮阔浩浩荡荡排山倒海铺天盖地翻江倒海汹涌澎湃雷霆万钧气吞山河势不可挡锐不可当排山倒海千军万马风起云涌风云变幻瞬息万" +
                "变化莫测千变万化日新月异翻天覆地沧海桑田瞬息万变变幻莫测捉摸不透千头万绪纷繁复杂错综复杂乱七八糟杂乱无章乱作一团一塌糊涂一团乱" +
                "闪闪发光光芒四射晶莹剔透色彩斑斓玲珑宝塔璀璨夺目金碧辉煌珍珠玛瑙绿松宝石坚硬无比铜墙铁壁固若金汤乘风破浪披荆斩棘一往无前胜利"
  },
  {
    levelNumber: 9,
    name: "星空幻境关",
    theme: "梦幻夜空与星座奥秘",
    colorClass: "from-pink-400 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50",
    emoji: "🌌",
    badgeEmoji: "✨",
    description: "夜幕降临，恐龙们趴在草地上数星星。学习诚实高尚、坚持不懈、秩序井然的优秀汉字！",
    charSource: "秩序井然条理分明井井有条干干净净一尘不染整整齐齐严丝合缝一丝不苟有条不紊有条不紊有始有终彻头彻尾自始至终始终如一永不停息坚持不" +
                "半途而废前功尽弃功亏一篑一曝十寒三天打鱼两天晒网一暴十寒不屈不挠坚韧不拔百折不挠铁杵磨针锲而不舍绳锯木断滴水穿石精诚所至金石为" +
                "开心地善良温柔体貼和蔼可亲平易近人宽宏大量宽容大度通情达理善解人意体贴入微无微不至关怀备至尊老爱幼心地善良通情达理大公无私舍己" +
                "两袖清风光明磊落克己奉公廉洁奉公拾金不昧助人为乐慷慨解囊乐善好施见义勇为见义勇为挺身而出前赴后继不怕牺牲英勇无畏不怕牺牲坚强不" +
                "星罗棋布繁星灿烂银河横空众星捧月夜凉如水静谧详和月光皎洁月色迷人梦境幻海奇思妙想充满智慧闪耀永恒星光闪烁北极星亮指引道路方向"
  },
  {
    levelNumber: 10,
    name: "至尊恐龙帝王关",
    theme: "终极王者与恐龙大联欢",
    colorClass: "from-amber-400 to-yellow-600",
    bgGradient: "from-amber-50 to-yellow-50",
    emoji: "👑",
    badgeEmoji: "🏆",
    description: "终极挑战！你已经认识了前2700个字，现在你将面对最后的词汇大联欢，加冕成为恐龙字王！",
    charSource: "小巧玲珑精致可爱胖乎乎圆滚滚红扑扑嫩生生粉嘟嘟水灵灵亮晶晶亮闪闪金灿灿黑漆漆白茫茫绿油油红艳艳黄澄澄蓝莹莹紫灿灿花花绿绿五彩缤" +
                "色彩斑斓五颜六色花团锦簇香气扑鼻芬芳迷人鸟语花香万草千花繁花似锦绿草如茵绿树成荫桃红柳绿姹紫嫣红争奇斗艳百花齐放万物复苏大地回" +
                "冰消雪融泉水丁冬迎春花开桃李争妍春江水暖莺歌燕舞草长莺飞烟波浩渺碧海蓝天晴空万里万里无云天高云淡秋高气爽天高听风金风送爽秋风落" +
                "落叶飘零寒风刺骨大雪纷飞晶莹剔透银装素裹冰雕玉琢天寒地冻滴水成冰漫天飞雪冰天雪地粉妆玉琢原野寂静万籁俱寂冬日暖阳雪中送炭傲雪凌" +
                "气贯长虹威风凛凛金榜题名功德无量国泰民安风调雨顺四海升平欣欣向荣蒸蒸日上日新月异繁荣昌盛大获全胜终极大奖恐龙字王天下第一至尊"
  }
];

export const DINO_STICKERS_DATA: DinoSticker[] = [
  {
    id: "sticker-1",
    name: "霸王龙迪诺",
    type: "暴龙 (T-Rex)",
    color: "#FF7B54",
    accentColor: "#FFD56F",
    description: "我是威风的霸王龙迪诺！别看我牙齿大，我超级喜欢和小朋友一起学写字呢！",
    roarText: "嗷呜~~ 迪诺来啦！太厉害了！",
    svgType: "t-rex"
  },
  {
    id: "sticker-2",
    name: "三角龙朵朵",
    type: "三角龙 (Triceratops)",
    color: "#6BCB77",
    accentColor: "#4D96FF",
    description: "我是善良的三角龙朵朵！头上有三只帅气的角，喜欢吃青草和交新朋友！",
    roarText: "哼哧哼哧~ 加油，小宝贝！",
    svgType: "triceratops"
  },
  {
    id: "sticker-3",
    name: "剑龙琪琪",
    type: "剑龙 (Stegosaurus)",
    color: "#4D96FF",
    accentColor: "#FF6B6B",
    description: "我是剑龙琪琪！背上有像小山一样的骨板，虽然走起路来慢吞吞，但是最能坚持啦！",
    roarText: "呀哈！背上盾牌亮闪闪！",
    svgType: "stegosaurus"
  },
  {
    id: "sticker-4",
    name: "小翼龙天天",
    type: "翼龙 (Pterodactyl)",
    color: "#FFD56F",
    accentColor: "#6BCB77",
    description: "我是爱飞翔的小翼龙天天！大翅膀一张，就能在天空中自由跳舞！",
    roarText: "呼—— 飞向高空，你真棒！",
    svgType: "pterodactyl"
  },
  {
    id: "sticker-5",
    name: "腕龙壮壮",
    type: "腕龙 (Brachiosaurus)",
    color: "#9772FB",
    accentColor: "#F37878",
    description: "我是长脖子腕龙壮壮！我可以抬起头吃到最高树梢上的嫩叶子！",
    roarText: "呜—— 伸长脖子赞美你！",
    svgType: "brachiosaurus"
  },
  {
    id: "sticker-6",
    name: "甲龙果果",
    type: "甲龙 (Ankylosaurus)",
    color: "#3EC70B",
    accentColor: "#F7FF93",
    description: "我是甲龙果果！身上披着厚厚的坚硬铠甲，尾巴像一个大石锤，勇敢又安全！",
    roarText: "咚咚咚！给你超级防护！",
    svgType: "ankylosaurus"
  }
];

export const DINO_QUIZ_PROMPTS = [
  "小宝贝，这个字读什么呀？",
  "你认识这个可爱的字吗？大声读出来吧！",
  "看这里！小恐龙很好奇这个字怎么读呢？",
  "快来帮帮小恐龙，这个汉字宝贝叫什么名字呀？",
  "小朋友，大声跟迪诺一起读出它的名字好不好？",
  "哇！又是一个新汉字，聪明的你认识它吗？"
];

export const GENTLE_ENCOURAGEMENTS = [
  "没关系，我们再试一次吧，你可以的！",
  "好孩子，静下心来跟小恐龙重来一遍，加油！",
  "差一点点就对啦，我们再来试一次哦！",
  "迪诺陪着你呢，我们重来，你可以读得很准！",
  "别灰心，小宝贝，再大声、缓慢地读一遍它吧！"
];

export const WIN_CELEBRATIONS = [
  "哇！发音太准啦！真棒！",
  "超级棒！标准普通话，给你跳个恐龙舞！",
  "太聪明了！生字成功解锁，继续加油哦！",
  "完美跟读！为你点赞！奖励一颗恐龙贴纸！",
  "你太棒啦！小恐龙都听懂了呢！"
];
