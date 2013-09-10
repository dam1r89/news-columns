(function($, window){

    'use strict';

    function Grid(ops){
        this.options = $.extend({}, this.defaults, ops);
        this.options.method = this.options.animate && !this.options.transform ? 'animate' : 'css';
        this.init();
    }

    Grid.prototype = {

        defaults: {
            selector: '.grid',
            transform: true,
            animate: true,
            colSpacing: 20,
            marginTop: 0,
            marginLeft: 0,
            speed: 200
        },
        refresh: function(){
            this.arrange();
        },
        setVars: function(){
            this.elementWidth = this.$elements.first().outerWidth(true);
            this.gridWidth = this.$grid.width();
        },
        findElements: function() {
            this.$grid = $(this.options.selector);
            this.$elements = this.$grid.children();
        },
        setStyle: function(){
            this.$grid.css({
                position: 'relative'
            });
            var elementCss = {
                position:'absolute',
                visibility: 'hidden'
            }
            if (this.options.transform && this.options.animate){
                elementCss.transition = this.options.speed+'ms';
            }
            this.$elements.css(elementCss);
        },
        arrange: function(){
            this.setVars();
            var _this = this,
                colsPerRow = Math.max(Math.floor(this.gridWidth / this.elementWidth),1),
                lasts = [],
                targetPosition;

            this.$elements.each(function(ind){
                var $this = $(this).css({
                    visibility: 'visible'
                });

                if (ind < colsPerRow)
                {
                    //prvi red redjaj redom
                    if (ind){
                        //ako je prvi element u drugom, trecem... redu
                        var $prev = $this.prev();
                        targetPosition = {
                            top: _this.options.marginTop,
                            left: $prev.data('targetPosition').left + $prev.outerWidth(true) + _this.options.colSpacing
                        };
                    }
                    else{
                        //ako je prvi element u prvom redu
                        targetPosition = {
                            top: _this.options.marginTop,
                            left: _this.options.marginLeft
                        };
                    }
                    lasts.push($this);

                }
                else{
                    var minPos, minInd;
                    $.each(lasts, function(i){
                        var $this = $(this);
                        if (i){
                            var thisMin = $this.data('targetPosition').top + $this.outerHeight(true);
                            if (thisMin < minPos){
                                minPos = thisMin;
                                minInd = i;
                            }
                        }
                        else{
                            //prvi je najmanji
                            minPos = $this.data('targetPosition').top + $this.outerHeight(true);
                            minInd = i;
                        }
                    });
                    var minEl = $(lasts.splice(minInd, 1, $this)[0]); //izbaci stari element i stavi novi;
                    targetPosition = {
                        top: minEl.data('targetPosition').top + minEl.outerHeight(true),
                        left: minEl.data('targetPosition').left
                    };

                }

                $this.stop(true)[_this.options.method](_this.getPosition(targetPosition), _this.options.speed).data('targetPosition',targetPosition);

            });
            //racuna donju velicinu da poveca kontejner
            var maxPos = 0;
            $.each(lasts, function(){
                var $this = $(this),
                    thisMax = $this.data('targetPosition').top + $this.outerHeight(true);

                if (thisMax > maxPos){
                    maxPos = thisMax;
                }
            });
            _this.$grid.css({
                height: maxPos
            });
        },
        getPosition: function(position){
                return this.options.transform ? {transform: 'translate(' + position.left + 'px,' + position.top + 'px)'} : position;
        },
        init: function(){

            this.findElements();
            this.setStyle();
            this.arrange();

        }

    };

    window.Grid = Grid;

})(jQuery, window);
