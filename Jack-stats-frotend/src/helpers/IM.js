// import AV from 'leancloud-storage';

import AV from 'leancloud-storage';

export default class {
    constructor(staffid, userid) {
        this.conversation = null;
        this.staffid = staffid;
        this.userid = userid;
        this.messages = [];
    }

    async init() {
        let conversations = await IMClient.getQuery().containsMembers(['staff' + this.staffid, 'user' + this.userid]).find();

        if (conversations.length) {
            this.conversation = await IMClient.getConversation(conversations[0].id, true);
        } else {
            this.conversation = await IMClient.createConversation({
                members: ['user' + this.userid],
                user_id: 'user' + this.userid,
                unique: true,
            });
        }

        return conversations;
    }

    async send(content, type, obj) {
        if (!this.conversation) return;
        this.message = new AV.TextMessage(content);

        let showTime = this.compareTime();

        let form = {
            message_type: type,
            show_time: showTime,
        };
        if (obj) Object.assign(form, obj);
        this.message.setAttributes(form);
        await this.conversation.send(this.message);
        this.messages.push(this.message);
    }

    async checkOnline() {
        // 判断对方是否在线
        let res = await IMClient.ping(['user' + this.userid]);
        if (!res.length) {
            let data = null;
            for (let i = this.messages.length - 1; i >= 0; i--) {
                if (this.messages[i].from === 'user' + this.userid) {
                    data = this.messages[i];
                    break;
                }
            }
            await API.post('employee/patients/check-online/' + this.userid, {
                userContent: data ? this.filterMessage(data) : '',
                staffContent: this.filterMessage(this.message),
            });
        }
    }

    filterMessage(val) {
        switch (val.getAttributes().message_type) {
            case 'image':
                return '[图片]';
            case 'audio':
                return '[语音]';
            case 'custom':
                return '[处方单]';
            case 'examination':
                return '[检查单]';
            case 'treatment':
                return '[诊疗单]';
            case 'serve':
                return '[服务单]';
            default:
                return val.getText();
        }
    }

    compareTime() {
        // 对比当前时间与上一条信息的时间，判断是否显示时间
        let showTime = true;
        if (this.messages.length) {
            let date = this.messages[this.messages.length - 1].timestamp;
            let last = Date.parse(new Date(date)) / 1000;
            let now = Date.parse(new Date()) / 1000;
            let time = now - last;
            if (time < 60) {
                showTime = false;
            }
        }
        return showTime;
    }

    createIterator(limit = 10) {
        // 获取聊天记录，创建一个迭代器，每次获取 10 条历史消息
        this.messageIterator = this.conversation.createMessagesIterator({limit});
        this.nextPage();
    }

    async nextPage(done) {
        // 第一次调用 next 方法，获得前 10 条消息，还有更多消息，done 为 false
        const res = await this.messageIterator.next();
        this.messages = [...res.value, ...this.messages];
        this.done = res.done;
    }
}
