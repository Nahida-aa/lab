// 定义音乐数据结构
export interface Song {
  id: number;
  title: string;
  img: string;
  artist: string;
  audioSrc: string;
  lyrics: { time: number; text: string }[];
}
export const songs: Song[] = [
  {
    id: 1,
    title: "童话镇",
    img: "/avatar/star-360-d.webp",
    artist: "暗杠",
    audioSrc: "/music/梁玖希 - 童话镇.mp3",
    lyrics: [
      { time: 0, text: "梁玖希 - 童话镇" },
      { time: 22, text: "听说白雪公主在逃跑" },
      { time: 26, text: "小红帽在担心大灰狼" },
      { time: 29, text: "听说疯帽喜欢爱丽丝" },
      { time: 33, text: "丑小鸭会变成白天鹅" },
      { time: 36, text: "听说彼得潘总长不大" },
      { time: 40, text: "杰克他有竖琴和魔法" },
      { time: 43, text: "听说森林里有糖果屋" },
      { time: 46, text: "灰姑娘丢了心爱的玻璃鞋" },
      { time: 50, text: "只有睿智的河水知道" },
      { time: 53, text: "白雪是因为贪玩跑出了城堡" },
      { time: 57, text: "小红帽有件抑制自己" },
      { time: 60, text: "变成狼的大红袍" },
      { time: 63, text: "总有一条蜿蜒在童话镇里七彩的河" },
      { time: 71, text: "沾染魔法的乖张气息" },
      { time: 74, text: "却又在爱里曲折" },
      { time: 77, text: "川流不息扬起水花" },
      { time: 80, text: "又卷入一帘时光入水" },
      { time: 84, text: "让所有很久很久以前" },
      { time: 87, text: "都走到幸福结局的时刻" },
      { time: 107, text: "听说睡美人被埋藏" },
      { time: 110, text: "小人鱼在眺望金殿堂" },
      { time: 113, text: "听说阿波罗变成金乌" },
      { time: 117, text: "草原有奔跑的剑齿虎" },
      { time: 120, text: "听说匹诺曹总说着谎" },
      { time: 124, text: "侏儒怪拥有宝石满箱" },
      { time: 127, text: "听说悬崖有棵长生树" },
      { time: 110, text: "红鞋子不知疲倦地在跳舞" },
      { time: 134, text: "只有睿智的河水知道" },
      { time: 137, text: "睡美人逃避了生活的煎熬" },
      { time: 141, text: "小人鱼把阳光抹成眼影" },
      { time: 144, text: "投进泡沫的怀抱" },
      { time: 147, text: "总有一条蜿蜒在童话镇里七彩的河" },
      { time: 155, text: "沾染魔法的乖张气息" },
      { time: 158, text: "却又在爱里曲折" },
      { time: 161, text: "川流不息扬起水花" },
      { time: 164, text: "又卷入一帘时光入水" },
      { time: 168, text: "让所有很久很久以前" },
      { time: 171, text: "都走到幸福结局的时刻" },
      { time: 175, text: "总有一条蜿蜒在童话镇里梦幻的河" },
      { time: 182, text: "分隔了理想分隔现实" },
      { time: 185, text: "又在前方的山口汇合" },
      { time: 189, text: "川流不息扬起水花" },
      { time: 192, text: "又卷入一帘时光入水" },
      { time: 196, text: "让所有很久很久以前" },
      { time: 199, text: "都走到幸福结局的时刻" },
      { time: 202, text: "又陌生" },
    ]
  },
  {
    id: 2,
    title: "温迪的生日祝福",
    img: "/music/img/温迪.png",
    artist: "温迪",
    audioSrc: "/music/温迪生日.mp3",
    lyrics: [
      { time: 0, text: "我以前听朋友说生日是要吃蛋糕的" },
      { time: 3, text: "…喏，苹果蛋糕，给，勺子" },
      { time: 6, text: "烤出来的时候有点塌了" },
      { time: 8, text: "所以看上去像是苹果派" },
      { time: 11, text: "欸嘿，甜点还真是复杂呀" },
    ]
  },
  {
    id: 3,
    title: "安柏的生日祝福",
    img: "/music/img/安柏.png",
    artist: "安柏",
    audioSrc: "/music/安柏生日.mp3",
    lyrics: [
      { time: 0, text: "嘿嘿嘿，生日快乐！" },
      { time: 2, text: "来，这个给你" },
      { time: 4, text: "是我亲手缝的「兔兔伯爵·特别定制版」" },
      { time: 8, text: "…放心放心，是特别定制版哦" },
      { time: 11, text: "不会爆炸的！" },
    ]
  },
  {
    id: 4,
    title: "凯亚的生日祝福",
    img: "/music/img/凯亚.png",
    artist: "凯亚",
    audioSrc: "/music/凯亚生日.mp3",
    lyrics: [
      { time: 0, text: "值得庆贺的日子" },
      { time: 1, text: "祝你今天能得到真正的快乐" },
    ]
  },
  {
    id:5,
    title: "琴的生日祝福",
    img: "/music/img/琴.png",
    artist: "琴",
    audioSrc: "/music/琴生日.mp3",
    lyrics: [
      { time: 0, text: "今天是值得庆祝的日子" },
      { time: 2, text: "要说为何的话" },
      { time: 3, text: "因为这是受风护佑的你" },
      { time: 5, text: "诞生的日子啊" },
      { time: 7, text: "既然是生日" },
      { time: 9, text: "那就好好休息一下吧" },
      { time: 11, text: "咳咳…祝你生日快乐…" },
      { time: 17, text: "啊，请原谅我的冒昧" },
      { time: 21, text: "不知这份礼物，是否能令你满意呢？" },
    ]
  },
  {
    id: 6,
    title: "丽莎的生日祝福",
    img: "/music/img/丽莎.png",
    artist: "丽莎",
    audioSrc: "/music/丽莎生日.mp3",
    lyrics: [
      { time: 0, text: "来，拿着，护身符" },
      { time: 3, text: "就作为生日礼物送给你了" },
      { time: 5, text: "虽然制作起来花了我不少时间…" },
      { time: 9, text: "不许弄丢哦" },
    ]
  },
  {
    id: 7,
    title: "迪卢克的生日祝福",
    img: "/music/img/迪卢克.png",
    artist: "迪卢克",
    audioSrc: "/music/迪卢克生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐，这是属于你的重要日子" },
      { time: 4, text: "说吧，你的心愿" },
      { time: 7, text: "如果在我能力范围之内，我会考虑的" },
    ]
  },
  {
    id: 8,
    title: "芭芭拉的生日祝福",
    img: "/music/img/芭芭拉.png",
    artist: "芭芭拉",
    audioSrc: "/music/芭芭拉生日.mp3",
    lyrics: [
      { time: 0, text: "请收下！这个是给你的生日礼物" },
      { time: 3, text: "专属签名绘哟~" },
      { time: 5, text: "欸嘿" },
      { time: 6, text: "等下一首新歌，我会第一时间唱给你听的！" },
      { time: 9, text: "生日快乐呀！" },
    ]
  },
  {
    id: 9,
    title: "凝光的生日祝福",
    img: "/music/img/凝光.png",
    artist: "凝光",
    audioSrc: "/music/凝光生日.mp3",
    lyrics: [ 
      { time: 0, text: "这是选用上等的霓裳花织出的锦缎" },
      { time: 3, text: "拿去做件自己喜欢的衣服" },
      { time: 6, text: "过个开心点的生日吧" },
    ]
  },
  {
    id: 10,
    title: "公子的生日祝福",
    img: "/music/img/公子.png",
    artist: "公子",
    audioSrc: "/music/公子生日.mp3",
    lyrics: [
      { time: 0, text: "哟，伙伴，生日快乐！" },
      { time: 3, text: "有什么想痛打一顿的人吗？" },
      { time: 4, text: "有的话，就尽管说出来吧！" },
    ]
  },
  {
    id: 11,
    title: "魈的生日祝福",
    img: "/music/img/魈.png",
    artist: "魈",
    audioSrc: "/music/魈生日.mp3",
    lyrics: [
      { time: 0, text: "诞生的时日" },
      { time: 2, text: "…人类的这些纪念" },
      { time: 5, text: "真是冗余" },
      { time: 8, text: "嗯…等着" },
      { time: 11, text: "我给你折一只梧桐树叶蝴蝶" },
      { time: 15, text: "好了，拿去吧" },
      { time: 18, text: "这是仙法，可以辟邪" },
    ]
  },
  {
    id: 12,
    title: "钟离的生日祝福",
    img: "/music/img/钟离.png",
    artist: "钟离",
    audioSrc: "/music/钟离生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐" },
      { time: 2, text: "这是曾在你出生的那天盛开的" },
      { time: 4, text: "「琉璃百合」的干花" },
      { time: 6, text: "很久以前的璃月人会说" },
      { time: 9, text: "这种花承载着大地中的美好记忆与祈愿而盛开" },
      { time: 14, text: "我愿意相信，你的诞生也是同样的道理" },
    ]
  },
  {
    id: 13,
    title: "七七的生日祝福",
    img: "/music/img/七七.png",
    artist: "七七",
    audioSrc: "/music/七七生日.mp3",
    lyrics: [
      { time: 0, text: "生辰快乐" },
      { time: 2, text: "给，草药香囊" },
      { time: 6, text: "很惊讶吗？" },
      { time: 9, text: "上次你告诉我的时候" },
      { time: 11, text: "我就记在纸上了" },
      { time: 15, text: "每天都看一遍的话" },
      { time: 18, text: "今后也不会忘记的…" },
    ]
  },
  {
    id: 14,
    title: "白术的生日祝福",
    img: "/music/img/白术.png",
    artist: "白术, 长生",
    audioSrc: "/music/白术生日.mp3",
    lyrics: [
      { time: 0, text: "长生：那话怎么说来着…哎呀，白术，提醒我一下" },
      { time: 5, text: "白术：过生日时的吉利话吗？" },
      { time: 6, text: "长生：对对对" },
      { time: 8, text: "白术：愿你年年有今日，岁岁有今朝。旅行者，生日快乐" },
      { time: 13, text: "长生：话都被你说了。那我说什么？" },
      { time: 17, text: "算了我再想点别的" },
      { time: 20, text: "我祝旅行者…嗯…嗯…唉，想不出来了" },
      { time: 28, text: "祝你心情愉快吧" },
      { time: 31, text: "你们笑什么嘛，人就是麻烦，比蛇还会弯弯绕" },
    ]
  },
  {
    id:15,
    title: "甘雨的生日祝福",
    img: "/music/img/甘雨.png",
    artist: "甘雨",
    audioSrc: "/music/甘雨生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐" },
      { time: 1, text: "这么久以来受你的关照" },
      { time: 4, text: "但却没有准备礼物" },
      { time: 6, text: "这点实在…" },
      { time: 8, text: "藏在手后面的？" },
      { time: 10, text: "欸，你看到了啊…" },
      { time: 13, text: "是，失败了的清心花凉糕…抱" },
      { time: 17, text: "抱着必须做完美的决心结果…" },
      { time: 20, text: "欸，好，好吃的？" },
      { time: 25, text: "真…真的吗" },
    ]
  },
  {
    id: 16,
    title: "行秋的生日祝福",
    img: "/music/img/行秋.png",
    artist: "行秋",
    audioSrc: "/music/行秋生日.mp3",
    lyrics: [
      { time: 0, text: "咳，咳咳" },
      { time: 2, text: "恭祝你福寿与天齐" },
      { time: 5, text: "庆贺你生辰快乐" },
    ]
  },
  {
    id: 17,
    title: "香菱的生日祝福",
    img: "/music/img/香菱.png",
    artist: "香菱",
    audioSrc: "/music/香菱生日.mp3",
    lyrics: [
      { time: 0, text: "啊，找到你了！" },
      { time: 2, text: "快来，我给你做了一整桌的菜喔！" },
      { time: 5, text: "嘿嘿，不用急着夸我" },
      { time: 7, text: "先等你尝过味道再慢慢说吧！" },
    ]
  },
  {
    id: 18,
    title: "可莉的生日祝福",
    img: "/music/img/可莉.png",
    artist: "可莉",
    audioSrc: "/music/可莉生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐！" },
      { time: 1, text: "过生日很开心" },
      { time: 3, text: "你比可莉大" },
      { time: 4, text: "那过生日的次数一定比可莉多吧？" },
      { time: 7, text: "可莉很羡慕！" },
    ]
  },
  {
    id: 19,
    title: "雷泽的生日祝福",
    img: "/music/img/雷泽.png",
    artist: "雷泽",
    audioSrc: "/music/雷泽生日.mp3",
    lyrics: [
      { time: 0, text: "今天是你的…" },
      { time: 2, text: "你是在很多很多个月以前的" },
      { time: 5, text: "今天出生的" },
      { time: 7, text: "想和你一起开心" },
      { time: 10, text: "今天一起吃肉" },
    ]
  },
  {
    id: 20,
    title: "莫娜的生日祝福",
    img: "/music/img/莫娜.png",
    artist: "莫娜",
    audioSrc: "/music/莫娜生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐" },
      { time: 1, text: "这个袋子给你" },
      { time: 3, text: "里面有一个帮你渡过难关的「建议」" },
      { time: 6, text: "别着急打开" },
      { time: 8, text: "在往后的一年之内" },
      { time: 10, text: "这个袋子会有自己打开的机会" },
    ]
  },
  {
    id: 21,
    title: "刻晴的生日祝福",
    img: "/music/img/刻晴.png",
    artist: "刻晴",
    audioSrc: "/music/刻晴生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐！" },
      { time: 1, text: "我为你准备了一份特别的礼物" },
      { time: 4, text: "别看这只是一盏普普通通的灯" },
      { time: 6, text: "只要有一点点雷元素力" },
      { time: 8, text: "就可以点亮很长时间" },
      { time: 10, text: "就可以点亮很长时间" },
      { time: 11, text: "在你需要光的时候，就用它吧" },
    ]
  },
  {
    id: 22,
    title: "菲谢尔的生日祝福",
    img: "/music/img/菲谢尔.png",
    artist: "菲谢尔, 奥兹",
    audioSrc: "/music/菲谢尔生日.mp3",
    lyrics: [
      { time: 0, text: "菲谢尔：哼哼，既然今日是你的命定之日" },
      { time: 5, text: "那我不可能坐视不管" },
      { time: 8, text: "来，说吧！" },
      { time: 10, text: "在这腐朽而幽邃的世界里" },
      { time: 13, text: "在你渺小而短暂的人生中" },
      { time: 16, text: "有什么想要实现的愿望" },
      { time: 18, text: "尽管说来，让本皇女听听！" },
      { time: 21, text: "嗯…即使是…" },
      { time: 24, text: "奥兹：她说「生日快乐，如果你想要，她」… " },
      { time: 29, text: "菲谢尔：奥兹！多嘴！ " },
    ]
  },
  {
    id: 23,
    title: "散兵的生日祝福",
    img: "/music/img/散兵.png",
    artist: "散兵",
    audioSrc: "/music/散兵生日.mp3",
    lyrics: [
      { time: 0, text: "把手给我" },
      { time: 3, text: "…呵，别紧张啊" },
      { time: 5, text: "只是带你去高处看看而已" },
      { time: 8, text: "如何？应当是非凡的景色" },
      { time: 13, text: "感谢就免了，谢来谢去的没意思" },
    ]
  },
  {
    id: 24,
    title: "砂糖的生日祝福",
    img: "/music/img/砂糖.png",
    artist: "砂糖",
    audioSrc: "/music/砂糖生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐！，。，，" },
      { time: 1, text: "我做了好几个月的实验" },
      { time: 3, text: "终于，可以把这个药水送给你了" },
      { time: 5, text: "它能唤醒你这一年来最美好的回忆" },
      { time: 8, text: "名字叫做「生物秘药叁玖壹陆号」" },
      { time: 13, text: "…唔，不是「叁壹玖陆号」" },
      { time: 15, text: "是「叁玖壹陆号」啦！" },
    ]
  },
  {
    id: 25,
    title: "罗莎莉亚的生日祝福",
    img: "/music/img/罗莎莉亚.png",
    artist: "罗莎莉亚",
    audioSrc: "/music/罗莎莉亚生日.mp3",
    lyrics: [
      { time: 0, text: "今天是你生日" },
      { time: 2, text: "有什么想处理的人或事吗？" },
      { time: 4, text: "我可以帮个小忙" },
      { time: 6, text: "别告诉其他人就行" },
    ]
  },
  {
    id: 26,
    title: "烟绯的生日祝福",
    img: "/music/img/烟绯.png",
    artist: "烟绯",
    audioSrc: "/music/烟绯生日.mp3",
    lyrics: [
      { time: 0, text: "生日快乐 这个匣子送你" },
      { time: 2, text: "里面是我为你准备的各国律法资料" },
      { time: 5, text: "你不是要去四处旅行了嘛" },
      { time: 8, text: "提前了解一下别国的律法肯定有用" },
      { time: 11, text: "不过也别学得太好哦" },
      { time: 15, text: "不然…我就没法帮你的忙了" },
    ]
  },
]