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
                ok:'Insert'
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

                    <p>Type LaTeX here: </p>
                    <p><input id="note-latex" class="form-control"></p>
                    <p>Math of what you typed: </p>
                    <div style="min-height:20px;"><span class="note-math"></span></div>
    
                    <script>
                    let $mathElement = $('.note-math');
                    let mathSpan = $mathElement[0];
                    let latexSpan = document.getElementById('note-latex');

                    
                    latexSpan.addEventListener('keyup', renderMath);

                    function renderMath(){
                        let oldMath = mathSpan.innerHTML;
                        
                        try {
                            katex.render(this.value, mathSpan);
                        }
                        catch(e) { 
                            // KaTeX parse error while typing
                            mathSpan.innerHTML = oldMath;
                        }
                    }

                    </script>

                    </div>`;
                this.$dialog=ui.dialog({
                    title:lang.math.dialogTitle,
                    body:body,
                    footer:'<button class="btn btn-primary note-math-btn">'+lang.math.ok+'</button>'
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

                // reset the dailog input and math
                self.$dialog.find('.note-math').empty();
                self.$dialog.find('#note-latex').val('');

                // to edit an existing element
                // var $vid = $($editable.data('target'));
                let mathInfo = {};
                //     vidDom: $vid,
                //     href: $vid.attr('href')
                //     };
                this.showMathDialog(mathInfo).then(function(mathInfo){
                    ui.hideDialog(self.$dialog);
                    let $mathNode=self.$dialog.find('.note-math').clone();
                    // We restore cursor position and element is inserted in correct pos.
                    context.invoke('editor.restoreRange');
                    context.invoke('editor.focus');
                    context.invoke('editor.insertNode',$mathNode[0]);

                });
            };

            this.showMathDialog = function(editorInfo) {
                return $.Deferred(function (deferred) {
                    $editBtn = self.$dialog.find('.note-math-btn');
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
