// ==UserScript==
// @name         四川法考自动答题
// @namespace    https://dev.limkim.xyz/
// @version      1.0.1
// @description  2023年四川省年度学法考试自动完成
// @author       limkim
// @match        *://xxpt.scxfks.com/study/exams/*
// @license MIT
// @icon         https://dev.limkim.xyz/favicon.ico
// @run-at       document-end
// ==/UserScript==


(function () {
  'use strict';
  // 题库
  const answers = {
    "[单选]根据《中国共产党党徽党旗条例》规定，中国共产党党徽为（）组成的图案。": "D",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，推进全面依法治国，以（）为着力点。": "B",
    "[单选]根据《中国共产党党徽党旗条例》规定，不符合党徽直径的通用尺度的是（）。": "A",
    "[单选]习近平总书记在中央全面依法治国工作会议上指出，要坚持建设（）法治体系。": "B",
    "[单选]根据我国宪法规定，审计机关在（）领导下，依照法律规定独立行使审计监督权。": "D",
    "[单选]根据我国宪法规定，地方各级人民代表大会是（）机关。": "B",
    "[单选]国家工作人员就职时应当依照法律规定公开进行（）。": "C",
    "[单选]中国特色社会主义最本质的特征是（）。": "D",
    "[单选]我国宪法规定，中国坚持独立自主的对外政策，推动构建（）。": "B",
    "[单选]（）是中华人民共和国的根本制度。": "B",
    "[单选]依据民法典的规定，遗产分割时，应当保留胎儿的继承份额。胎儿出生时是死体的，保留的份额（）。": "A",
    "[单选]自然人下落不明满（）的，利害关系人可以向人民法院申请宣告该自然人为失踪人。": "C",
    "[单选]王小明和杨梅是一对恩爱的情侣，二人都是2000年出生。请问二人最早可以在哪一年领取结婚证？（）": "D",
    "[单选]养子女与生父母的权利义务关系，什么时间消除？（）": "B",
    "[单选]（）是推进全面依法治国的总抓手。": "B",
    "[单选]大黄在老朋友蔡头那里买了一辆汽车，可蔡头还没来得及去车辆管理部门办理登记，大黄就兴奋地开车上了高速公路，打算试试这辆车的性能，结果因大黄操作不善与前车发生追尾。那么下列表述正确的是？（）": "D",
    "[单选]当事人就合同中关于履行地点的约定不明确，且该合同需要交付不动产，那么该合同应当在哪里履行？（）": "C",
    "[单选]属于遗产法定继承顺序中的第二顺序继承人的是（）。": "D",
    "[单选]网购商品使用快递送达的，商品在快递途中、签收前损毁的风险由（）承担。": "B",
    "[单选]民法典规定，不满（）周岁的自然人为未成年人。": "C",
    "[单选]租房期间，房东变卖房子，租客与原房东的租赁合同效力（）。": "A",
    "[单选]全民国家安全教育日是（）。": "D",
    "[单选]根据反间谍法的规定，（）依法协调指导、监督检查反间谍安全防范工作。": "B",
    "[单选]根据反间谍法的规定，国家安全机关因反间谍工作需要，根据国家有关规定，经过严格的批准手续，可以采取技术侦察措施和（）。": "B",
    "[单选]国家安全机关在反间谍工作中必须依靠（）的支持，动员、组织人民防范、制止间谍行为。": "B",
    "[单选]（）是国家治理体系和治理能力的重要依托。": "C",
    "[单选]《中华人民共和国网络安全法》规定，关键信息基础设施的运营者在中华人民共和国境内运营中收集和产生的个人信息和重要数据应当在（）存储。": "A",
    "[单选]（）是党执政兴国的第一要务。": "D",
    "[单选]（）是全面建设社会主义现代化国家的首要任务。": "A",
    "[单选]坚持以人民为中心发展教育，加快建设（），发展素质教育，促进教育公平。": "D",
    "[单选]全面推进（）。坚持农业农村优先发展，坚持城乡融合发展，畅通城乡要素流动。": "A",
    "[单选]坚持社会主义市场经济改革方向，坚持高水平对外开放，加快构建以（）为主体、（）相互促进的新发展格局。": "C",
    "[单选]《中华人民共和国刑法》规定：违反保守国家秘密法规，故意或过失泄露国家军事秘密，情节特别严重的，处（）有期徒刑。": "C",
    "[单选]犯罪预备，是指为了犯罪，准备工具创造条件的行为。下列不属于犯罪预备的是（）。": "C",
    "[单选]对正当防卫的理解，下列说法错误的是（）。": "C",
    "[单选]死刑是严格控制的，根据我国刑法规定，它只对（）的犯罪分子适用。": "D",
    "[单选]习近平新时代中国特色社会主义思想明确中国特色社会主义事业总体布局是（）。": "A",
    "[单选]《中华人民共和国刑法》规定，在共同犯罪中起次要或者辅助作用的共同犯罪人是（）。": "B",
    "[单选]《中华人民共和国行政处罚法》规定，行政法规可以设定除（）以外的行政处罚。": "A",
    "[单选]《中华人民共和国行政处罚法》规定，行政机关实施行政处罚时，应当责令当事人（）或者（）违法行为。": "A",
    "[单选]《中华人民共和国行政处罚法》规定，执法人员应当文明执法，尊重和保护当事人（）。": "D",
    "[单选]《中华人民共和国行政复议法》规定，调解未达成协议或者调解书生效前一方反悔的，（）机关应当依法审查或者及时作出（）决定。": "B",
    "[单选]《中华人民共和国行政诉讼法》规定，人民法院审理上诉案件，应当对原审人民法院的判决、裁定和被诉行政行为进行（）。": "C",
    "[单选]《四川省人民代表大会议事规则》规定，省人民代表大会会议举行前，召开预备会议，选举主席团和秘书长，通过会议议程和关于会议其他准备事项的决定。预备会议决定事项，以全体代表过（）通过。": "B",
    "[单选]《四川省数据条例》规定：（），是指政务部门和公共服务组织向社会依法提供公共数据的行为。": "C",
    "[单选]《四川省反不正当竞争条例》所称（），是指不为公众所知悉、具有商业价值并经权利人采取相应保密措施的技术信息、经营信息等商业信息。": "A",
    "[单选]《四川省优化营商环境条例》规定，营造民营企业、中小企业健康发展环境，支持（）、（）参与市场竞争。": "B",
    "[单选]我们要坚持把依法治国和以德治国结合起来，高度重视道德对公民行为的（）作用。": "B",
    "[单选]《四川省禁毒条例》规定，农村土地承包人和农村土地承包经营权流转受让人发现土地内有涉嫌毒品违法犯罪活动的，应当及时向（）报告。": "B",
    "[单选]《四川省无障碍环境建设管理办法》规定，建设工程设计单位应当按照无障碍设施工程建设标准设计无障碍设施，并对（）负责。": "D",
    "[单选]《四川省消防规划管理规定》规定，城乡规划主管部门在实施建设项目规划许可时，不得违反（）的要求。": "B",
    "[单选]《四川省机关事务管理办法》规定，政府各部门不得（）、（）办公用房或者改变办公用房使用功能。": "C",
    "[单选]《四川省突发事件应对办法》规定，突发事件应对工作以（），（）相结合，实行统一领导、综合协调、分类管理、分级负责、属地管理为主的应急管理体制。": "A",
    "[单选]《四川省省级财政预算管理办法》规定，省政府全部收入和支出实行（）管理。": "D",
    "[单选]《四川省行政调解工作暂行办法》是为了（），依法及时有效化解争议纠纷，深入推进法治政府建设，维护社会和谐稳定，根据《四川省纠纷多元化解条例》等法律规定，结合实际制定的。": "B",
    "[单选]根据《四川省行政调解工作暂行办法》第三十三条，下列不属于行政调解协议书应当载明事项的是（）。": "A",
    "[单选]《中华人民共和国预防未成年人犯罪法》规定，教育行政部门应当会同有关部门建立（）制度。学校应当加强日常安全管理，完善学生欺凌发现和处置的工作流程，严格排查并及时消除可能导致学生欺凌行为的各种隐患。": "A",
    "[单选]《中华人民共和国预防未成年人犯罪法》规定，公安机关在对未成年人进行矫治教育时，未成年人的父母或者其他监护人应当积极配合（）措施的实施，不得妨碍阻挠或者放任不管。": "C",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，党的领导是推进全面依法治国的（）。": "C",
    "[单选]《中华人民共和国未成年人保护法》规定，未成年人合法权益受到侵犯，相关组织和个人未代为提起诉讼的，（）可以督促、支持其提起诉讼。": "D",
    "[单选]习近平在省部级主要领导干部学习贯彻十八届四中全会精神全面推进依法治国专题研讨班开班式上的讲话中指出，改革开放以来特别是（）提出依法治国、建设社会主义法治国家以来，我国社会主义法治建设取得了重大成就，各级领导干部在推进依法治国进程中发挥了重要作用。": "B",
    "[单选]党的十八届四中全会审议通过《中共中央关于全面推进依法治国若干重大问题的决定》，习近平总书记在关于《决定》的说明中指出：“（）是法治建设的核心问题。”": "B",
    "[单选]习近平总书记在中央全面依法治国工作会议上指出，推进全面依法治国是（）。": "A",
    "[单选]关于建设中国特色社会主义法治体系的意义，下列说法错误的是（）。": "B",
    "[单选]根据《中国共产党党徽党旗条例》规定，中国共产党党旗为旗面缀有（）图案的红旗。": "B",
    "[单选]习近平总书记在中央全面依法治国工作会议上指出，（）是司法的灵魂和生命。": "D",
    "[单选]习近平总书记在中央政法工作会议上强调，我国政法工作的基本任务是（）。": "A",
    "[单选]全面推进依法治国的重点任务和主体工程是（）。": "A",
    "[单选]全面依法治国的重要组织者、推动者、实践者是（）。": "D",
    "[单选]习近平法治思想是党的（）以来法治建设最重要的标志性成果。": "B",
    "[单选]习近平法治思想的核心要义是（）。": "B",
    "[单选]推进全面依法治国的总目标是（）。": "B",
    "[单选]习近平总书记在中央全面依法治国委员会第三次会议上指出，我国社会主义（）凝聚着我们党治国理政的理论成果和实践经验，是制度之治最基本最稳定最可靠的保障。": "C",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，要加强宪法实施和监督，推进（）工作，对一切违反宪法法律的法规、规范性文件必须坚决予以纠正和撤销。": "A",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，要用（）给行政权力定规矩、划界限，规范行政决策程序，健全政府守信践诺机制，提高依法行政水平。": "D",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，要继续完善（）制度，有效维护社会公共利益。": "D",
    "[单选]根据《中国共产党党徽党旗条例》规定，党徽党旗（）必须坚持统一标准、统一规范，坚持分级负责、集中管理。": "D",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，我们党历来重视法治建设。党的十八大以来，党中央明确提出（），并将其纳入“四个全面”战略布局予以有力推进。": "D",
    "[单选]下列（）不属于习近平法治思想的“十一个坚持”。": "D",
    "[单选]根据《中国共产党章程》总纲的规定，民族精神的核心是（）。": "B",
    "[单选]《中国共产党章程》中指出，我国的社会主义建设，必须从我国的国情出发，走中国特色社会主义道路，以（）全面推进中华民族伟大复兴。": "B",
    "[单选]根据《中国共产党章程》规定，要充分发挥科学技术作为第一生产力的作用，充分发挥（）作为第一资源的作用，充分发挥创新作为引领发展第一动力的作用，依靠科技进步，提高劳动者素质，促进国民经济更高质量、更有效率、更加公平、更可持续、更为（）发展。": "D",
    "[单选]根据《中国共产党章程》规定，新时代新征程,经济和社会发展的战略目标是，到（）年基本实现社会主义现代化，到（）把我国建成社会主义现代化强国。": "D",
    "[单选]《中国共产党章程》总纲规定，广开言路，建立健全民主选举、（）、民主决策、民主管理、民主监督的制度和程序。完善中国特色社会主义法律体系，加强法律实施工作，实现国家各项工作法治化。": "D",
    "[单选]根据《中国共产党纪律检查委员会工作条例》规定，党的各级（）是党内监督专责机关，是党推进全面从严治党、开展党风廉政建设和反腐败斗争的专门力量。": "D",
    "[单选]根据《中国共产党纪律检查委员会工作条例》规定，党的中央纪律检查委员会全体会议（）至少召开一次，由中央纪律检查委员会常务委员会召集并主持。": "B",
    "[单选]《中国共产党组织工作条例》规定，（）实行党中央集中统一领导，各级党委（党组）分级分类领导，组织部门专门负责，有关方面各司其职、密切配合的领导体制。": "D",
    "[单选]根据《党政领导干部选拔任用工作条例》规定，党政领导干部应当（）。特别优秀或者工作特殊需要的干部，可以突破任职资格规定或者（）担任领导职务。": "A",
    "[单选]《中国共产党党徽党旗条例》共（）条、（）个附件，涵盖党徽党旗生产制作、使用管理、监督问责等方面。": "C",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，要坚持（）对全面依法治国的领导。": "A",
    "[单选]《推进领导干部能上能下规定》指出，推进领导干部能上能下，重点是解决（）。": "C",
    "[单选]《中国共产党农村工作条例》明确规定，各级党委应当完善（）领导决策机制，注重发挥人大代表和政协委员作用，注重发挥智库和专业研究机构作用，提高决策科学化水平。": "B",
    "[单选]《中国共产党农村工作条例》指出，各级党委应当注重发挥科技教育对农业农村发展的（）作用。": "B",
    "[单选]（）是指中国共产党领导的、以工农联盟为基础的，包括全体社会主义劳动者、社会主义事业的建设者、拥护社会主义的爱国者、拥护祖国统一和致力于中华民族伟大复兴的爱国者的联盟。": "B",
    "[单选]《中国共产党政治协商工作条例》明确规定，人民政协政治协商活动具体工作方案应当根据批准的（）制定。": "B",
    "[单选]《中国共产党机构编制工作条例》明确规定，建立机构编制（），各级机构编制委员会在本级党委一届任期内至少组织1次管理范围内的机构编制（）。": "B",
    "[单选]（）是党的生命，是党内政治生活积极健康的重要基础。": "A",
    "[单选]《中国共产党廉洁自律准则》紧扣廉洁自律、坚持正面倡导、面向全体党员、突出（），强调自律，重在立德。": "B",
    "[单选]根据《关于新形势下党内政治生活的若干准则》规定，（）是党最根本、最重要的纪律，遵守党的（）是遵守党的全部纪律的基础。": "B",
    "[单选]（）是党的根本政治立场。": "B",
    "[单选]《中国共产党党徽党旗条例》2021年6月17日中共中央政治局常委会会议审议批准，2021年6月26日（）发布。": "A",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，要坚持以（）为中心。": "B",
    "[单选]党组织应当保障检举控告人的权益，对检举控告人的信息以及检举控告内容必须严格保密，严禁将检举控告材料转给被检举控告的组织和人员。提倡和鼓励（）检举控告。": "A",
    "[单选]《中国共产党党内监督条例》明确规定，党内监督没有（）、没有（）。": "D",
    "[单选]《中国共产党党内监督条例》明确规定，严格党的（）制度，民主生活会应当经常化，遇到重要或者普遍性问题应当及时召开。": "C",
    "[单选]《中国共产党党内监督条例》明确规定，在纪律审查中发现党的领导干部严重违纪涉嫌违法犯罪的，应当先作出（）决定，再移送行政机关、司法机关处理。": "A",
    "[单选]《党政领导干部考核工作条例》明确规定，考核要坚持从实际出发，实行（）考核。": "D",
    "[单选]《中国共产党党员权利保障条例》明确规定，党员有党内（），有权经过规定程序成为候选人和当选。": "A",
    "[单选]党的二十大的主题是：高举中国特色社会主义伟大旗帜，全面贯彻新时代中国特色社会主义思想，弘扬伟大建党精神，自信自强、守正创新，（）、勇毅前行，为全面建设社会主义现代化国家、全面推进中华民族伟大复兴而团结奋斗。": "C",
    "[单选]中国共产党第二十次全国代表大会，是在全党全国各族人民迈上（）、向第二个百年奋斗目标进军的关键时刻召开的一次十分重要的大会。": "A",
    "[单选]党的二十大报告指出，育人的根本在于（）。全面贯彻党的教育方针，落实（）根本任务，培养德智体美劳全面发展的社会主义建设者和接班人。": "A",
    "[单选]党的二十大报告指出，我们党立志于中华民族千秋伟业，致力于人类和平与发展崇高事业，责任无比重大，使命无上光荣。全党同志务必（），务必（），务必（），坚定历史自信，增强历史主动，谱写新时代中国特色社会主义更加绚丽的华章。①不忘初心、牢记使命②谦虚谨慎、艰苦奋斗③勤劳勇敢、自强不息④敢于斗争、善于斗争": "B",
    "[单选]《中国共产党党徽党旗条例》根据（）制定。": "A",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，推进全面依法治国，根本目的是（）。": "C",
    "[单选]党的二十大报告指出，我们要实现好、维护好、发展好（），紧紧抓住人民最关心最直接最现实的利益问题，坚持尽力而为、量力而行，深入群众、深入基层，采取更多惠民生、暖民心举措，着力解决好人民群众急难愁盼问题，健全基本公共服务体系，提高公共服务水平，增强均衡性和可及性，扎实推进共同富裕。": "D",
    "[单选]党的二十大报告指出，如期实现建军一百年奋斗目标，加快把人民军队建成世界一流军队，是全面建设社会主义现代化国家的（）。": "B",
    "[单选]党的二十大报告指出，（）是中国特色社会主义的伟大创举，是香港、澳门回归后保持长期繁荣稳定的最佳制度安排，必须长期坚持。": "C",
    "[单选]党的二十大报告指出，中国始终坚持维护世界和平、促进共同发展的外交政策宗旨，致力于推动（）。": "B",
    "[单选]党的二十大报告指出，全党必须牢记，（）永远在路上，党的自我革命永远在路上，决不能有松劲歇脚、疲劳厌战的情绪，必须持之以恒推进全面从严治党，深入推进新时代党的建设新的伟大工程，以党的自我革命引领社会革命。": "B",
    "[单选]党的二十大报告指出，坚持制度治党、依规治党，以党章为根本，以（）为核心，完善党内法规制度体系，增强党内法规权威性和执行力，形成坚持真理、修正错误，发现问题、纠正偏差的机制。": "C",
    "[单选]党的二十大报告指出，全党要把青年工作作为（）来抓，用党的科学理论武装青年，用党的初心使命感召青年，做青年朋友的知心人、青年工作的热心人、青年群众的引路人。": "C",
    "[单选]党的二十大报告指出，我们隆重庆祝中国共产党成立一百周年、中华人民共和国成立七十周年，制定（）历史决议，在全党开展党史学习教育，建成中国共产党历史展览馆，号召全党学习和践行伟大建党精神，在新的征程上更加坚定、更加自觉地牢记初心使命、开创美好未来。": "C",
    "[单选]党的二十大报告指出，（）是国家治理的一场深刻革命，关系党执政兴国，关系人民幸福安康，关系党和国家长治久安。": "C",
    "[单选]党的二十大报告指出，坚持依法治国首先要坚持（），坚持依法执政首先要坚持依宪执政，坚持宪法确定的中国共产党领导地位不动摇，坚持宪法确定的人民民主专政的国体和人民代表大会制度的政体不动摇。": "A",
    "[单选]根据《中国共产党党徽党旗条例》的规定，召开党的全国代表大会、代表会议和地方各级代表大会、代表会议，在显著位置悬挂党徽，并在党徽两侧各布（）面红旗。": "C",
    "[单选]习近平总书记在中央全面依法治国工作会议上指出，要坚持中国特色社会主义法治道路。中国特色社会主义法治道路本质上是中国特色社会主义道路在（）的具体体现。": "D",
    "[单选]党的二十大报告指出，（）是全面依法治国的重点任务和主体工程。": "C",
    "[单选]党的二十大报告指出，坚持（）在我国现代化建设全局中的核心地位。": "C",
    "[单选]党的二十大报告指出，人心是最大的政治，（）是凝聚人心、汇聚力量的强大法宝。": "B",
    "[单选]党的二十大报告指出，实践告诉我们，中国共产党为什么能，中国特色社会主义为什么好，归根到底是马克思主义行，是（）的马克思主义行。拥有马克思主义科学理论指导是我们党坚定信仰信念、把握历史主动的根本所在。": "A",
    "[单选]党的二十大报告指出，中国积极参与全球治理体系改革和建设，践行（）的全球治理观，坚持真正的多边主义，推进国际关系民主化，推动全球治理朝着更加公正合理的方向发展。": "D",
    "[单选]从现在起，中国共产党的（）就是团结带领全国各族人民全面建成社会主义现代化强国、实现第二个百年奋斗目标，以中国式现代化全面推进中华民族伟大复兴。": "C",
    "[单选]下列各项中，既是基本权利也是基本义务的是（）。": "A",
    "[单选]宪法是国家根本法，是（）意志的集中体现。": "C",
    "[单选]一切国家机关和武装力量、各政党和各社会团体、各企业事业组织，都必须以（）为根本的活动准则。": "A",
    "[单选]特别行政区的设立及其制度由（）决定。": "A",
    "[单选]根据《中国共产党党徽党旗条例》规定，中国共产党的党徽党旗是中国共产党的（）。": "A",
    "[单选]习近平总书记在中央全面依法治国工作会议上指出，要传承中华优秀传统法律文化，从我国革命、建设、改革的实践中探索适合自己的法治道路，同时（），为全面建设社会主义现代化国家、实现中华民族伟大复兴夯实法治基础。": "B",
    "[单选]一切国家机关实行（）的原则，实行工作责任制，实行工作人员的培训和考核制度，不断提高工作质量和工作效率，反对官僚主义。": "B",
    "[单选]国家（）非公有制经济的发展，并对非公有制经济依法实行监督和管理。": "B",
    "[单选]宪法以（）的形式确认了中国各族人民奋斗的成果，规定了国家的根本制度和根本任务，是国家的根本法，具有最高的法律效力。": "B",
    "[单选]下列哪一项不属于现行宪法明文规定的公民的基本权利（）。": "B",
    "[单选]根据我国宪法规定，国家行政机关、监察机关、审判机关、检察机关都由（）产生。": "A",
    "[单选]除依照法律被剥夺政治权利的人外，年满（）的中国公民都有选举权和被选举权。": "A",
    "[单选]在宪法所保障的基本权利中，最基本的一项是（）。": "B",
    "[单选]下列哪个选项不属于民族自治地方的自治机关（）。": "B",
    "[单选]根据我国宪法序言规定，中华人民共和国是全国各族人民共同缔造的（）。": "C",
    "[单选]根据我国宪法规定，城市的土地属于（）所有。": "D",
    "[单选]根据《中国共产党党徽党旗条例》规定，召开党的中央和地方委员会全体会议，在显著位置悬挂（）。": "A",
    "[单选]习近平总书记在中央全面依法治国工作会议上强调，要坚持依宪治国、依宪执政。（）领导人民制定宪法法律，领导人民实施宪法法律。": "D",
    "[单选]根据我国宪法规定，公民的（）私有财产不受侵犯。": "B",
    "[单选]根据我国宪法规定，国家建立健全同（）相适应的社会保障制度。": "D",
    "[单选]我国宪法规定，国有企业依照法律规定，通过（），实行民主管理。": "D",
    "[单选]国务院可以制定（）。": "B",
    "[单选]迄今为止，全国人民代表大会对现行宪法进行了（）次修改。": "A",
    "[单选]我国宪法规定，国家培养为社会主义服务的各种专业人才，扩大（）队伍，创造条件，充分发挥他们在社会主义现代化建设中的作用。": "C",
    "[单选]根据我国宪法规定，中华人民共和国公民在（）面前一律平等。": "A",
    "[单选]根据我国宪法规定，宗教团体和宗教事务不受（）的支配。": "B",
    "[单选]根据我国宪法规定，任何公民，非经（）批准或者决定或者人民法院决定，并由公安机关执行，不受逮捕。": "B",
    "[单选]由于国家机关和国家工作人员侵犯公民权利而受到损失的人，有依照法律规定取得（）的权利。": "B",
    "[多选]中央全面依法治国工作会议强调，习近平法治思想内涵丰富、论述深刻、逻辑严密、系统完备，从历史和现实相贯通、国际和国内相关联、理论和实际相结合上深刻回答了新时代（）等一系列重大问题。": "AB",
    "[多选]习近平总书记在中央全面依法治国工作会议上强调，要坚持党对全面依法治国的领导。国际国内环境越是复杂，改革开放和社会主义现代化建设任务越是繁重，越要运用法治思维和法治手段（），保证党和国家长治久安。": "ABC",
    "[多选]根据《互联网群组信息服务管理规定》，互联网群组信息服务提供者应当根据互联网群组的（）等实行分级分类管理。": "BCD",
    "[多选]《中共中央关于全面推进依法治国若干重大问题的决定》明确，优化司法职权配置。健全（）各司其职，侦查权、检察权、审判权、执行权相互配合、相互制约的体制机制。": "ABCD",
    "[多选]习近平总书记在中央全面依法治国工作会议上指出，要坚持建设中国特色社会主义法治体系。要加快形成（），形成完善的党内法规体系。": "ABCD",
    "[多选]《中共中央关于全面推进依法治国若干重大问题的决定》明确，加强职务犯罪线索管理，健全（）、信息反馈制度，明确纪检监察和刑事司法办案标准和程序衔接，依法严格查办职务犯罪案件。": "ABC",
    "[多选]中央全面依法治国工作会议强调，习近平法治思想是顺应实现中华民族伟大复兴时代要求应运而生的重大理论创新成果，是马克思主义法治理论中国化最新成果，是（），是（）。": "AB",
    "[多选]《中共中央关于全面推进依法治国若干重大问题的决定》明确，依纪依法反对和克服（）和奢靡之风，形成严密的长效机制。": "BCD",
    "[多选]习近平总书记在中央全面依法治国工作会议上强调，坚持依宪治国、依宪执政，就包括坚持宪法确定的（）不动摇，坚持宪法确定的（）和（）不动摇。": "ABC",
    "[多选]《中共中央关于全面推进依法治国若干重大问题的决定》明确，全面推进依法治国，必须大力提高法治工作队伍思想政治素质、业务工作能力、职业道德水准，着力建设一支()的社会主义法治工作队伍，为加快建设社会主义法治国家提供强有力的组织和人才保障。": "ABCD",
    "[多选]《中共中央关于全面推进依法治国若干重大问题的决定》明确，各级人大、（）的党组织要领导和监督本单位模范遵守宪法法律，坚决查处执法犯法、违法用权等行为。": "ABCD",
    "[多选]习近平总书记在中央全面依法治国工作会议上强调，要把（）落实到全面依法治国各领域全过程。": "ABCD",
    "[多选]习近平总书记在中央全面依法治国工作会议上指出，领导干部具体行使党的执政权和国家（）、（）、（）、（），是全面依法治国的关键。": "ABCD",
    "[多选]法治国家、法治政府、法治社会三者的关系是（）。": "ABCD",
    "[多选]各级领导干部必须强化法治意识，带头（），做制度执行的表率。": "ABCD",
    "[多选]全面依法治国是（）的重要基础。": "BCD",
    "[多选]习近平总书记在中央全面依法治国工作会议上强调，要坚持统筹推进（）和（）。要加快涉外法治工作战略布局，协调推进国内治理和国际治理，更好维护国家主权、安全、发展利益。": "AB",
    "[多选]《中国共产党章程》规定，坚持惩前毖后、治病救人,执纪必严、违纪必究，抓早抓小、防微杜渐，按照错误性质和情节轻重，给以（）、（）、（）直至（）。": "ABCD",
    "[多选]在习近平新时代中国特色社会主义思想指导下，中国共产党领导全国各族人民，统揽（）、（）、（）、（），推动中国特色社会主义进入了新时代，实现第一个百年奋斗目标，开启了实现第二个百年奋斗目标新征程。": "ABCD",
    "[多选]《中国共产党章程》规定，按照民主法治、公平正义、诚信友爱、充满活力、安定有序、人与自然和谐相处的总要求和共同建设、共同享有的原则，以保障和改善民生为重点，解决好人民最关心、最直接、最现实的利益问题，使（），（），努力形成（）、（）的局面。": "ABCD",
    "[多选]中国共产党自成立以来，始终把为（）、为（）作为自己的初心使命，历经百年奋斗，从根本上改变了中国人民的前途命运，开辟了（）的正确道路，展示了（）的强大生命力，深刻影响了世界历史进程，锻造了走在时代前列的中国共产党。": "ABCD",
    "[多选]《中国共产党章程》中指出，改革开放应当大胆探索，勇于开拓，提高改革决策的科学性，更加注重改革的（）、（）、（），在实践中开创新路。": "ACD",
    "[多选]《中国共产党农村工作条例》明确规定，党中央（）农村工作，（）农村工作大政方针，（）农村发展重大战略，（）农村重大改革。": "ABCD",
    "[多选]《中国共产党统一战线工作条例》要求围绕促进（）、（），推动民族地区经济社会发展，不断满足各族群众的美好生活需要。": "AB",
    "[多选]《中国共产党统一战线工作条例》指出，对台统一战线工作的主要任务是：贯彻执行党中央对台工作大政方针，坚持（）原则，广泛团结海内外台湾同胞，发展壮大台湾爱国统一力量，反对（）活动，不断推进（）进程，同心实现（）。": "ABCD",
    "[多选]《中国共产党政治协商工作条例》指出，政治协商是中国共产党领导的（）和（）的重要组成部分，是（）的重要形式，是凝聚智慧、增进共识、（）的重要途径。": "ABCD",
    "[多选]《中国共产党机构编制工作条例》规定，机构编制工作必须遵循以下原则：（）。": "ABCD",
    "[多选]《中国共产党廉洁自律准则》修订工作坚持的基本原则包括（）。": "ABC",
    "[多选]《关于新形势下党内政治生活的若干准则》指出，办好中国的事情，关键在党，关键在（）、（）。": "BC",
    "[多选]《关于新形势下党内政治生活的若干准则》指出，共产主义远大理想和中国特色社会主义共同理想，是中国共产党人的（）和（），也是保持党的团结统一的（）。": "ABC",
    "[多选]《关于新形势下党内政治生活的若干准则》指出，全党必须自觉防止和反对（）、（）、（）、（）。": "ABCD",
    "[多选]《中国共产党重大事项请示报告条例》明确规定，（）、（）或者（）的请示报告，应当采用书面方式。": "ACD",
    "[多选]《中国共产党党内监督条例》明确规定，党的（）、（）、（）全面领导党内监督工作。": "ACD",
    "[多选]《党政领导干部考核工作条例》中所指的考核方式主要包括：（）。": "ABCD",
    "[多选]《中国共产党问责条例》明确规定，问责决定作出后，应当及时向（）、（）及其（）宣布并督促执行。": "BCD",
    "[多选]《中国共产党党员权利保障条例》指出，党组织应当按照规定确定党务公开的（）、（）和（），保障党员及时了解党内事务。": "ABC",
    "[多选]《中国共产党党员权利保障条例》明确规定，党组织在巡视巡察和检查督查中，可以通过以下哪些方式，广泛收集和听取党员意见建议。（）": "ABCD",
    "[多选]党的二十大指出，前进道路上，必须牢牢把握以下重大原则：（）、（）、（）、（）、坚持发扬斗争精神。": "ABCD",
    "[多选]党的二十大报告指出，加快建设农业强国，扎实推动乡村（）、（）、（）、生态、组织振兴。": "ABC",
    "[多选]党的二十大报告指出，优化区域开放布局，巩固（）地区开放先导地位，提高（）和（）开放水平。": "BCD",
    "[多选]党的二十大报告指出，完善党中央对科技工作统一领导的体制，健全（），强化国家战略科技力量，优化配置创新资源，优化国家科研机构、高水平研究型大学、科技领军企业定位和布局，形成（），统筹推进国际科技创新中心、区域科技创新中心建设，加强科技基础能力建设，强化科技战略咨询，提升（）整体效能。": "ABD",
    "[多选]党的二十大报告指出，坚持面向（）、面向（）、面向（）、面向人民生命健康，加快实现高水平科技自立自强。": "ABD",
    "[多选]党的二十大报告指出，完善人才战略布局，坚持各方面人才一起抓，建设（）、（）、（）的人才队伍。": "ACD",
    "[多选]党的二十大报告指出，加快建设法治社会。法治社会是构筑法治国家的基础。弘扬社会主义法治精神，传承中华优秀传统法律文化，引导全体人民做社会主义法治的（）、（）、（）。": "ABC",
    "[多选]党的二十大报告指出，大自然是人类赖以生存发展的基本条件。（）、（）、（），是全面建设社会主义现代化国家的内在要求。必须牢固树立和践行绿水青山就是金山银山的理念，站在人与自然和谐共生的高度谋划发展。": "ABC",
    "[多选]党的二十大报告指出，强化社会治安整体防控，推进扫黑除恶常态化，依法严惩群众反映强烈的各类违法犯罪活动。发展壮大群防群治力量，营造见义勇为社会氛围，建设（）、（）、（）的社会治理共同体。": "BCD",
    "[多选]党的二十大报告指出，经过十八大以来全面从严治党，我们解决了党内许多突出问题，但党面临的执政考验、（）、（）、（）将长期存在，精神懈怠危险、能力不足危险、脱离群众危险、消极腐败危险将长期存在。": "ABC",
    "[多选]党的二十大报告指出，我们要落实新时代党的建设总要求，健全全面从严治党体系，全面推进党的（）、（）、（）、（），使我们党坚守初心使命，始终成为中国特色社会主义事业的坚强领导核心。": "ABCD",
    "[多选]党的二十大报告指出，增强党内政治生活（）、（）、（）、（），用好批评和自我批评武器，持续净化党内政治生态。": "ABCD",
    "[多选]党的二十大报告指出，深入实施区域协调发展战略、（）、（）、新型城镇化战略，优化重大生产力布局，构建优势互补、高质量发展的区域经济布局和国土空间体系。": "BC",
    "[多选]党的二十大报告指出，我们要健全人民当家作主制度体系，扩大人民有序政治参与，保证人民依法实行（）、（）、（）民主管理、民主监督，发挥人民群众积极性、主动性、创造性，巩固和发展生动活泼、安定团结的政治局面。": "BCD",
    "[多选]党的二十大报告指出，我们要坚持走中国特色社会主义法治道路，建设中国特色社会主义法治体系、建设社会主义法治国家，围绕保障和促进社会公平正义，坚持依法治国、依法执政、依法行政共同推进，坚持法治国家、法治政府、法治社会一体建设，全面推进（）、（）、（）、（），全面推进国家各方面工作法治化。": "ABCD",
    "[多选]党的二十大报告指出，加强（）、（）、（）立法，统筹推进国内法治和涉外法治，以良法促进发展、保障善治。推进科学立法、民主立法、依法立法，统筹立改废释纂，增强立法系统性、整体性、协同性、时效性。": "ABC",
    "[多选]党的二十大报告指出，十年来，我们经历了对党和人民事业具有重大现实意义和深远历史意义的三件大事：一是（），二是（），三是（），实现第一个百年奋斗目标。": "ABC",
    "[多选]党的二十大报告指出，锲而不舍落实中央八项规定精神，抓住“关键少数”以上率下，持续深化纠治“四风”，重点纠治（）、（），坚决破除特权思想和特权行为。": "AB",
    "[多选]党的二十大报告指出，我们要坚持对马克思主义的坚定信仰、对中国特色社会主义的坚定信念，坚定（）、（）、（）、（），以更加积极的历史担当和创造精神为发展马克思主义作出新的贡献，既不能刻舟求剑、封闭僵化，也不能照抄照搬、食洋不化。": "ABCD",
    "[多选]习近平总书记在中央全面依法治国工作会议上强调，要坚持（）共同推进，法治国家、法治政府、法治社会一体建设。": "BCD",
    "[多选]党的二十大报告指出，我们必须坚持解放思想、实事求是、与时俱进、求真务实，一切从实际出发，着眼解决新时代改革开放和社会主义现代化建设的实际问题，不断回答（）、（）、（）、（），作出符合中国实际和时代要求的正确回答，得出符合客观规律的科学认识，形成与时俱进的理论成果，更好指导中国实践。": "ABCD",
    "[多选]合理实施下列哪些行为的，可以不经肖像权人同意。（）": "ABCD",
    "[多选]以下禁止以任何形式买卖的包括（）。": "ABCD",
    "[多选]当事人在订立合同过程中有下列情形之一，造成对方损失的，应当承担赔偿责任。（）": "ABC",
    "[多选]下列财产为夫妻一方的个人财产。（）": "CD",
    "[多选]自老伴去世后，张某独自生活在自己名下的房屋中，直到2016年，张某与李某相识……黄昏相恋，两人并没有像情窦初开的年轻人一样去领小红本，而是自然而然地共同生活在这民居中，相濡以沫。已到耄耋之年的张某立下字据：若我死后，李某可以继续居住在我位于某某镇的房子中。后张某去世，张某的儿女欲将该房屋出租，与李某发生争执，并诉至法院要求李某腾退房屋。李某以其对该房屋享有居住权进行抗辩。下列说法正确的是（）。": "AD",
    "[多选]根据反间谍法的规定，国家安全机关是反间谍工作的主管机关。公安、保密等有关部门和军队有关部门按照（），（），（），依法做好有关工作。": "ABC",
    "[多选]根据反间谍法的规定，各级人民政府和有关部门应当组织开展反间谍安全防范宣传教育，将反间谍安全防范知识纳入（）、（）、（）内容，增强全民反间谍安全防范意识和国家安全素养。": "ABC",
    "[多选]《中华人民共和国网络安全法》规定，对可能严重危害（）的关键信息基础设施，在网络安全等级保护制度的基础上，实行重点保护。": "ABC",
    "[多选]根据《中华人民共和国生物安全法》规定，国家建立（）、（）、（）的生物安全应急制度。": "ABD",
    "[多选]习近平总书记在中央全面依法治国工作会议上强调，要坚持统筹推进（）和（）。": "BC",
    "[多选]《中华人民共和国反恐怖主义法》规定，本法所称恐怖主义，是指通过（）、（）、（）等手段，制造社会恐慌、危害公共安全、侵犯人身财产，或者胁迫国家机关、国际组织，以实现其政治、意识形态等目的的主张和行为。": "ABC",
    "[多选]推动经济社会发展（）、（）是实现高质量发展的关键环节。": "AD",
    "[多选]深入推进环境污染防治。坚持（）、（）、（），持续深入打好蓝天、碧水、净土保卫战。": "ABD",
    "[多选]坚持把发展经济的着力点放在实体经济上，推进新型工业化，加快建设（）、（）、（）、（）、网络强国、数字中国。": "ABCD",
    "[多选]促进区域协调发展。深入实施（）、（）、（）、（），优化重大生产力布局，构建优势互补、高质量发展的区域经济布局和国土空间体系。": "ABCD",
    "[多选]优化基础设施（）、（）、（）和（），构建现代化基础设施体系。": "ABCD",
    "[多选]刘某因无证醉酒驾车造成重大人员伤亡，被法院终审判处无期徒刑，剥夺政治权利终身。从本案例中可以看出（）。": "ABD",
    "[多选]《中华人民共和国刑法》规定，判处管制，可以根据犯罪情况，同时禁止犯罪分子在执行期间（），进入（），接触（）。": "ABC",
    "[多选]我国刑法规定，传授犯罪方法的，处（）有期徒刑、拘役或者管制;情节严重的，处（）有期徒刑;情节特别严重的，处（）有期徒刑或者（）。": "ABCD",
    "[多选]《中华人民共和国反有组织犯罪法》规定：对有组织犯罪案件的犯罪嫌疑人、被告人，根据办理案件和维护监管秩序的需要，可以采取（）、（）或者（）等措施。": "ABC",
    "[多选]习近平总书记在中央全面依法治国工作会议上指出，要坚持建设德才兼备的高素质法治工作队伍。要加强理想信念教育，深入开展社会主义核心价值观和社会主义法治理念教育，推进法治专门队伍（），确保做到忠于党、忠于国家、忠于人民、忠于法律。": "ABCD",
    "[多选]我国刑法规定，国家工作人员利用职务上的便利，（）、（）、（）或者以其他手段（）的，是贪污罪。。": "ABCD",
    "[多选]《中华人民共和国行政许可法》所称行政许可，是指行政机关根据（）、（）或者（）的申请，经依法审查，准予其从事特定活动的行为。": "BCD",
    "[多选]《中华人民共和国行政许可法》规定，行政机关作出准予行政许可的决定，需要颁发行政许可证件的，应当向申请人颁发加盖本行政机关印章的下列行政许可证件：（）。": "ABCD",
    "[多选]《中华人民共和国行政处罚法》规定，国务院部门规章可以在法律、行政法规规定的给予行政处罚的（）、（）和（）的范围内作出具体规定。": "ACD",
    "[多选]《中华人民共和国行政复议法》明确规定，下列事项不属于行政复议范围：（）。": "ABCD",
    "[多选]《中华人民共和国公务员法》规定，公务员担任（）、（）、（）及其有关部门主要领导职务的，应当按照有关规定实行地域回避。": "BCD",
    "[多选]《四川省人民代表大会议事规则》规定，提出质询案必须写明质询（）、质询的（）和（）。": "ABC",
    "[多选]四川省行政区域内（）、（）、（）、（）和区域合作等活动，适用《四川省数据条例》。": "ABCD",
    "[多选]《四川省反不正当竞争条例》规定，监督检查部门应当通过（）、（）等方式开展反不正当竞争法治宣传。": "BC",
    "[多选]《四川省优化营商环境条例》明确规定，新闻媒体应当及时、准确宣传优化营商环境的措施和成效，推广典型经验，营造（）、（）、（）、（）的社会氛围。": "ABCD",
    "[多选]习近平总书记在中央全面依法治国工作会议上强调，要坚持抓住领导干部这个“关键少数”。各级领导干部要坚决贯彻落实党中央关于全面依法治国的重大决策部署，带头（），不断提高运用法治思维和法治方式深化改革、推动发展、化解矛盾、维护稳定、应对风险的能力，做尊法学法守法用法的模范。": "ABCD",
    "[多选]《四川省禁毒条例》规定，（）、（）应当在居民公约、村规民约中约定禁毒的内容，加强对居民、村民的禁毒宣传教育。": "AB",
    "[多选]《四川省无障碍环境建设管理办法》规定，无障碍设施改造由（）或者（）负责。": "AC",
    "[多选]在四川省行政区域内（）、（）消防规划，适用《四川省消防规划管理规定》。": "BC",
    "[多选]《四川省机关事务管理办法》规定，机关事务工作应当遵循（）、（）、（）、（）的原则。": "ABCD",
    "[多选]《四川省突发事件应对办法》规定，获悉发生或者可能发生突发事件信息的行政机关，应当按照规定（）、（），必要时可以（）。": "ABC",
    "[多选]《四川省省级财政预算管理办法》规定，省级各部门应当依法依规编制部门决算草案，做到（）、（）、（）、（）。": "ABCD",
    "[多选]根据《四川省行政调解工作暂行办法》第四条，行政调解应当遵循的原则包括（）。": "ABC",
    "[多选]根据《四川省行政调解工作暂行办法》第三十九条，行政机关及相关组织可以建立行政调解员名录并向社会公布，积极引导、支持（）、（）依法参与本单位行政调解工作。": "AB",
    "[多选]根据《中华人民共和国电子商务法》规定，知识产权权利人认为其知识产权受到侵害的，有权通知电子商务平台经营者采取哪些必要措施？（）": "ABCD",
    "[多选]根据《互联网新闻信息服务管理规定》，申请互联网新闻信息服务许可，应当提交下列哪些人员的资质情况材料？（）": "BCD",
    "[是非]发展党员，必须把道德标准放在首位，经过党的支部，坚持个别吸收的原则。": "错",
    "[是非]《中国共产党章程》明确规定，构建社会主义和谐社会的总要求是民主法治、公平正义、诚信友爱、充满活力、安定有序、人与自然和谐相处。": "对",
    "[是非]党是根据自己的纲领和章程，按照民主集中制组织起来的统一整体。": "对",
    "[是非]《中国共产党章程》规定，坚持总体国家安全观，统筹发展和安全，坚决维护国家主权、安全、发展利益。": "对",
    "[是非]民主集中制是民主基础上的集中和集中指导下的民主相结合。": "对",
    "[是非]党的基层纪律检查委员会无需设立必要的工作机构，无需配备专职工作人员。": "错",
    "[是非]违反《中国共产党组织工作条例》有关规定的，根据情节轻重，给予批评教育、责令检查、诫勉、组织处理或者依规依纪依法给予处分。": "对",
    "[是非]《中国共产党组织工作条例》是根据《中国共产党章程》和有关法律制定的条例。": "对",
    "[是非]《党政领导干部选拔任用工作条例》规定，考察党政领导职务拟任人选，应当保证充足的考察时间，并通过相关程序。": "对",
    "[是非]《推进领导干部能上能下规定》规定，干部本人对调整决定不服的，不得申请复核或者提出申诉。": "错",
    "[是非]被撤销监护权的监护人无继续支付抚养费的义务。": "错",
    "[是非]民用航空器造成他人损害的，一定由民用航空器的经营者承担侵权责任。": "错",
    "[是非]因产品存在缺陷造成他人损害的，生产者应当承担侵权责任。": "对",
    "[是非]遗弃、逃逸的动物在遗弃、逃逸期间造成他人损害的，由动物原饲养人或者管理人承担侵权责任。": "对",
    "[是非]胎儿尚未出生，所以没有继承权。": "错",
    "[是非]收留走失的宠物狗，狗主人领养时，可向其要求支付一定饲养费。": "对",
    "[是非]旅客存在不配合安检、买短乘长、霸座等行为时，承运方可拒绝提供运输服务。": "对",
    "[是非]遗失物自发布招领公告之日起一年内无人认领的，归拾的者所有。": "错",
    "[是非]法律规定属于国家所有的财产，属于国家所有即全民所有。": "对",
    "[是非]不满八周岁的未成年人为限制民事行为能力人。": "错",
    "[是非]《中华人民共和国网络安全法》规定，国家公安部门协调有关部门建立健全网络安全风险评估和应急工作机制，制定网络安全事件应急预案，并定期组织演练。": "错",
    "[是非]《中华人民共和国网络安全法》规定，网络关键设备和网络安全专用产品应当按照相关国家标准的强制性要求，由具备资格的机构安全认证合格或者安全检测符合要求后，方可销售或者提供。": "对",
    "[是非]实施间谍行为，构成犯罪的，依法追究民事责任。": "错",
    "[是非]根据《中华人民共和国保守国家秘密法》，国家秘密的密级分为绝密、机密、秘密三级。": "对",
    "[是非]《中华人民共和国反恐怖主义法》规定，对禁止运输、寄递，存在重大安全隐患，或者客户拒绝安全查验的物品，不得运输、寄递。": "对",
    "[是非]根据《中华人民共和国循环经济促进法》，发展循环经济应当在技术可行、经济合理和有利于节约资源、保护环境的前提下，按照减量化优先的原则实施。": "对",
    "[是非]根据《中华人民共和国预算法》，分税制财政管理体制的具体内容和实施办法，按照全国人民代表大会的有关规定执行。": "错",
    "[是非]根据《中华人民共和国科学技术进步法》，国家鼓励科学技术研究开发与高等教育、产业发展相结合，鼓励学科交叉融合和相互促进。": "对",
    "[是非]根据《中华人民共和国中小企业促进法》，统计部门应当加强对中小企业的统计调查和监测分析，定期发布有关信息。": "对",
    "[是非]根据《优化营商环境条例》，营商环境是指企业等市场主体在市场经济活动中所涉及的体制机制性因素和条件。": "对",
    "[是非]根据刑法修正案（九）规定，在国家法律职业资格考试中，甲为了顺利通过，让乙代替自己参加考试，后被监考人员当场发现。甲和乙的行为构成代替考试罪。": "对",
    "[是非]国家工作人员利用本人职权或者地位形成的便利条件，通过其他国家工作人员职务上的行为，为请托人谋取不正当利益，索取请托人财物或者收受请托人财物的，以行贿论处。": "错",
    "[是非]公安机关核查有组织犯罪线索，可以按照国家有关规定采取调查措施。公安机关向有关单位和个人收集、调取相关信息和材料的，有关单位和个人可以拒绝提供。": "错",
    "[是非]境外的黑社会组织到中华人民共和国境内发展组织成员、实施犯罪，以及在境外对中华人民共和国国家或者公民犯罪的，不适用《中华人民共和国反有组织犯罪法》。": "错",
    "[是非]国家机关工作人员滥用职权或者玩忽职守，致使公共财产、国家和人民利益遭受重大损失的，处三年以下有期徒刑或者拘役;情节特别严重的，处三年以上七年以下有期徒刑。": "对",
    "[是非]行政机关工作人员办理行政许可，不得索取或者收受申请人的财物，不得谋取其他利益。": "对",
    "[是非]行政处罚决定依法作出后，当事人应当在行政处罚决定后随时予以履行。": "错",
    "[是非]《中华人民共和国行政复议法》明确规定，行政复议期间，行政复议机关无正当理由中止行政复议的，上级行政机关应当责令其恢复审理。": "对",
    "[是非]《中华人民共和国行政诉讼法》规定，涉及商业秘密的案件，当事人申请不公开审理的，可以不公开审理。": "对",
    "[是非]《中华人民共和国公务员法》规定，对公务员涉嫌职务违法和职务犯罪的，应当依法移送公安机关处理。": "错",
    "[是非]《四川省人民代表大会议事规则》规定，省人民代表大会会议举行选举的具体办法，由大会全体会议通过。": "对",
    "[是非]《四川省数据条例》规定，公共数据按照开放属性分为无条件开放、有条件开放。": "错",
    "[是非]《四川省反不正当竞争条例》规定，经营者应当落实主体责任，加强反不正当竞争内部控制与合规管理，自觉抵制不正当竞争行为。": "对",
    "[是非]《四川省优化营商环境条例》明确规定，没有法律、法规、规章依据，不得增设政务服务事项的办理条件和环节。": "对",
    "[是非]《四川省禁毒条例》规定，鼓励吸毒成瘾人员自行戒除毒瘾。吸毒人员可以自行到戒毒医疗机构接受戒毒治疗。": "对",
    "[是非]《四川省无障碍环境建设管理办法》规定，任何单位和个人不得损坏、侵占盲道、无障碍卫生间、轮椅通道等无障碍设施，或者改变其用途。": "对",
    "[是非]《四川省消防规划管理规定》规定，城乡规划批准前，审批机关组织专家和有关部门进行审查时，只需要消防队参加。": "错",
    "[是非]《四川省机关事务管理办法》规定，政府各部门应当根据机关资产配置标准，编制本部门机关资产配置计划，不得超标准配置资产。": "对",
    "[是非]《四川省突发事件应对办法》规定，市级以上地方人民政府应当加强应急预案落实情况的管理。": "错",
    "[是非]《四川省省级财政预算管理办法》规定，市级财政预算实行中期财政规划管理，确保主要财政政策相对稳定。": "错",
    "[是非]对实施电信网络诈骗犯罪的被告人，应当更加注重依法适用财产刑，加大经济上的惩罚力度，最大限度剥夺被告人再犯的能力。": "对",
    "[是非]个人银行账户号码、身份证号码、手机号码、手机验证码等信息不要轻易泄露。": "对",
    "[是非]全面依法治国是要加强和改善党的领导，健全党领导全面依法治国的制度和工作机制，推进党的领导制度化、法治化，通过法治保障党的路线方针政策有效实施。": "对",
    "[是非]全国统一反诈骗APP是“国家反诈中心”。": "对",
    "[是非]利用电信网络技术手段实施诈骗，诈骗公私财物价值三千元以上、三万元以上、五十万元以上的，应当分别认定为刑法第二百六十六条规定的“数额较大”“数额巨大”“数额特别巨大”。": "对",
    "[是非]明知他人实施诈骗犯罪，为其提供信用卡、手机卡等帮助的，以共同犯罪论处。": "对",
    "[是非]习近平总书记在中央全面依法治国工作会议上指出，要坚持在法治轨道上推进国家治理体系和治理能力现代化。法治是国家治理体系和治理能力的重要依托。": "对",
    "[是非]利用未成年人、在校学生、老年人、残疾人实施电信网络诈骗的，依法从严惩处。": "对",
    "[是非]电信业务经营者在经营活动中，违反国家有关规定，被电信网络诈骗犯罪分子利用，使他人遭受财产损失的，依法承担相应责任。构成犯罪的，依法追究刑事责任。": "对",
    "[是非]反电信网络诈骗专用号码是96110": "对"
  };

  let autoStart = localStorage.getItem('auto_start') === 'true';
  let autoSubmitInterval = localStorage.getItem('auto_submit_interval') || '';

  // 判断该选项正确性
  const isRight = (answer, option) => {
    const answerArray = answer.split('');
    for (let i = 0; i < answerArray.length; i++) {
      if (option.includes(answerArray[i])) {
        return true;
      }
    }
    return false;
  };

  // 答题部分
  const startAnswer = () => {
    const questions = document.querySelectorAll('#resource .item');
    questions.forEach(question => {
      let title = question.querySelector('h3.question-title').innerText;
      title = title.slice(0, 4) + title.split('. ')[1]
      const answer = answers[title.replaceAll(' ', '')];
      const options = question.querySelectorAll('.question-option label');
      options.forEach(option => {
        if (isRight(answer, option.innerText)) {
          option.querySelector('input').checked = true;
        }
      });
    });
    // 自动交卷
    if (autoSubmitInterval) {
      setTimeout(() => {
        document.querySelector('.button-list #JiaoJuan-exam').click();
        // document.querySelector('.button-list button').click();
      }, parseInt(autoSubmitInterval) * 1000);
    }
  }

  // 检验时间间隔输入
  const isValidNumber = (str) => {
    const pattern = /^(0|[1-9]\d{0,4}|[1-7]\d{4}|8[0-5]\d{3}|86[0-3]\d{2}|86400)$/; // 正则表达式模式
    return pattern.test(str);
  }

  // 控件部分
  const buttonList = document.querySelector('.button-list');
  buttonList.style.display = 'flex';
  buttonList.style.alignItems = 'baseline';
  buttonList.style.gap = '10px';

  const button = document.createElement('button');
  button.classList.add('button');
  button.innerText = '一键答题';
  button.style.color = '#ffffff';
  button.style.backgroundColor = '#e91e1e';
  button.addEventListener('click', startAnswer);

  const autoContainer = document.createElement('div');
  const autoCheckboxLabel = document.createElement('label');
  const autoCheckbox = document.createElement('input');
  autoContainer.style.display = 'flex';
  autoCheckbox.type = 'checkbox';
  autoCheckbox.checked = autoStart;
  autoCheckbox.addEventListener('change', (e) => {
    localStorage.setItem('auto_start', e.target.checked.toString());
    autoStart = e.target.checked;
  });
  autoCheckboxLabel.innerText = '自动开考:';
  autoContainer.append(autoCheckboxLabel, autoCheckbox)

  const submitContainer = document.createElement('div');
  const submitCheckboxLabel = document.createElement('label');
  const submitInput = document.createElement('input');
  submitContainer.style.display = 'flex';
  submitContainer.style.alignItems = 'center';
  submitInput.placeholder = '不填则不自动交卷';
  submitInput.style.width = '115px';
  submitInput.style.height = '25px';
  submitInput.style.boxShadow = '0 0 0 1px #c0c4cc inset';
  submitInput.style.border = 'none';
  submitInput.style.borderRadius = '5px';
  submitInput.value = autoSubmitInterval;
  submitInput.addEventListener('change', (e) => {
    if (isValidNumber(e.target.value)) {
      autoSubmitInterval = e.target.value;
    } else {
      e.target.value = '';
      autoSubmitInterval = '';
    }
    localStorage.setItem('auto_submit_interval', e.target.value);
  });
  submitCheckboxLabel.innerText = '多久后自动交卷(秒):';
  submitContainer.append(submitCheckboxLabel, submitInput);

  buttonList.append(button, autoContainer, submitContainer);

  // 自动开始
  if (autoStart) {
    startAnswer();
  }
})();
