Vue.component('question-answer', {
    props: ['question', 'answer', 'qindex', 'current', 'nextanswer', 'questions'],
    template: "<font :class='\"active-\"+(qindex==current-1)+\" q-and-a highlighted-\"+highlighted' v-if='show_qa()'> {{ question.prompt }}<span class='answer' @click='goto_question(qindex)'>&nbsp;{{ answer[question.key] }}<div class='text-cursor'></div></span><span class='suffix'>{{ question.suffix }}</span></font>",
    computed: {
        highlighted: function() {
            return (this.qindex < this.current);
        }
    },
    methods: {
        show_qa: function() {
            if (((this.qindex < this.current) || this.answer[this.question.key] && (this.current < this.questions.length+1))  && this.match_enquiry())
                return true;
            return false;
        },
        goto_question: function(qindex) {
            this.$emit('update:current', qindex+1);

            var input = document.querySelector('#app .questions input');
            console.log(input);
            if (input)
                input.focus();
        },
        match_enquiry: function() {
            if ((this.qindex > 1) && (this.qindex < this.questions.length-1)) {
                if (this.answer['enquiry_type'] == 'a project') {
                    return (this.question.key != this.nextanswer['a question'][0].key);
                }
                else {
                    return (this.question.key == this.nextanswer['a question'][0].key);
                }
            }
            else
                return true;
        }
    }
});

var app = new Vue({
    el: '#app',
    methods: {
        answer_option: function(option, event) {
            this.answer[this.conversationTree.questions[this.current-1].key] = option;

            if (this.answer['enquiry_type'] == 'a project') {
                if (this.conversationTree.questions[this.current].key == this.conversationTree.conversation[1].next_by_answer['a question'][0].key)
                    this.current += 2;
                else
                    this.next_question(event);
            }
            else if (this.current == this.conversationTree.questions.length - 1)
                this.next_question();
            else {
                this.current = this.conversationTree.questions.length - 1;
            }
        },
        next_question: function(event) {
            if ((event.type == 'click') || (event.target.value.length && (event.type == 'keyup')))
                this.current++;
            var input = document.querySelector('#app .questions input');
            console.log(input);
            if (input)
                input.focus();
        },
        get_json: function(response) {
            console.log(response);
        }
    },
    data: {
      answer: {},
      current: 1,
      conversationTree: {}
    },
    created: function() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var configTree = JSON.parse(this.responseText);
                app.conversationTree = configTree;
            }
        };
        xmlhttp.open("GET", "conversation1.json", true);
        xmlhttp.send();
    }
});