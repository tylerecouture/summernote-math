(function(factory){
    if(typeof define==='function'&&define.amd){
        define(['jquery'],factory);
    }else if(typeof module==='object'&&module.exports){
        module.exports=factory(require('jquery'));
    }else{
        factory(window.jQuery);
    }
}(function($){
    $.extend(true,$.summernote.lang,{
        'en-US':{ /* English */
            math:{
                dialogTitle:'Insert Math',
                tooltip:'Insert Math',
                pluginTitle:'Insert math',
                ok:'OK'
            }
        }
    });
    $.extend($.summernote.options,{
        math:{
            icon:'<b>&sum;</b>'
        }
    });
    $.extend($.summernote.plugins,{
        'math':function(context){
            var self=this;
            var ui=$.summernote.ui;
            var $note=context.layoutInfo.note;
            var $editor=context.layoutInfo.editor;
            var $editable=context.layoutInfo.editable;
            var options=context.options;
            var lang=options.langInfo;

            context.memo('button.math',function(){
                var button=ui.button({
                    contents:options.math.icon,
                    tooltip:lang.math.tooltip,
                    click:function(e){
                        // Cursor position must be saved because is lost when popup is opened.
                        context.invoke('editor.saveRange');
                        context.invoke('math.show');
                    }
                });
                return button.render();
            });

            this.initialize=function(){
                var $container=options.dialogsInBody?$(document.body):$editor;
                var body=`<div class="form-group">

                    <p>Type math here: <span id="math-field"></span></p>
                    <p>LaTeX of what you typed: <span id="latex"></span></p>
    
                    <script>
                    var mathFieldSpan = document.getElementById('math-field');
                    var latexSpan = document.getElementById('latex');
    
                    var MQ = MathQuill.getInterface(2); // for backcompat
                    var mathField = MQ.MathField(mathFieldSpan, {
                        spaceBehavesLikeTab: true, // configurable
                        handlers: {
                            edit: function() { // useful event handlers
                                latexSpan.textContent = mathField.latex(); // simple API
                            }
                        }
                    });
                    </script>

                    </div>`;
                this.$dialog=ui.dialog({
                    title:lang.math.dialogTitle,
                    body:body,
                    footer:'<button href="#" class="btn btn-primary note-math-btn">'+lang.math.ok+'</button>'
                }).render().appendTo($container);
            };

            this.destroy=function(){
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };

            this.bindEnterKey=function($input,$btn){
                $input.on('keypress',function(event){
                    if(event.keyCode===13)$btn.trigger('click');
                });
            };

            this.bindLabels=function(){
                self.$dialog.find('.form-control:first').focus().select();
                self.$dialog.find('label').on('click',function(){
                    $(this).parent().find('.form-control:first').focus();
                });
            };

            this.show=function(){
                //var $math=$($editable.data('target'));
                var editorInfo = {

                };
                this.showMathDialog(editorInfo).then(function(editorInfo){
                    ui.hideDialog(self.$dialog);
                    var $mathHTML=$('<div>');
                    var latex =  document.getElementById('latex');
                    var MQ = MathQuill.getInterface(2);
                    MQ.StaticMath($mathHTML[0]);
                    //$mathHTML.html(equation);
                    console.log($mathHTML[0]);

                    // We restore cursor position and element is inserted in correct pos.
                    context.invoke('editor.restoreRange');
                    context.invoke('editor.focus');
                    context.invoke('editor.insertNode',$mathHTML[0]);
                });
            };

            this.showMathDialog = function(editorInfo) {
                var $editBtn=self.$dialog.find('.note-math-btn');
                return $.Deferred(function (deferred) {
                    ui.onDialogShown(self.$dialog, function () {

                        context.triggerEvent('dialog.shown');
                        $editBtn.click(function (e) {
                            e.preventDefault();
                            deferred.resolve({

                            });
                        });
                        self.bindEnterKey($editBtn);
                        self.bindLabels();
                    });
                    ui.onDialogHidden(self.$dialog, function () {
                        $editBtn.off('click');
                        if (deferred.state() === 'pending') deferred.reject();
                    });
                    ui.showDialog(self.$dialog);
                });
            };

        }
    });
}));
