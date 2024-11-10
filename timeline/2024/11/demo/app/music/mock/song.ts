// 定义音乐数据结构
export interface Song {
  id: number;
  title: string;
  artist: string;
  audioSrc: string;
  lyrics: { time: number; text: string }[];
}
export const songs: Song[] = [
  {
    id: 1,
    title: "童话镇",
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
  // ... 可以添加更多歌曲
]