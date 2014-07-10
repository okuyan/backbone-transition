        (function() {

    window.app = {
        Views: {},
        Extensions: {},
        Router: null,

        init: function() {
            this.instance = new app.Views.App();
            Backbone.history.start();

        }
    };

    $(function() {

        window.app.init();

    });


    app.Router = Backbone.Router.extend({

        routes: {
            'second': 'second',            
            'first': 'first',
            '': 'first'
        },

        first: function() {
            var view = new app.Views.First();
            app.instance.goto(view);
        },

        second: function() {
            var view = new app.Views.Second();
            app.instance.goto(view);
        },
    });

    app.Extensions.View = Backbone.View.extend({

        initialize: function() {
            this.router = new app.Router();
        },

        render: function(options) {

            options = options || {};

            if (options.page === true) {
                this.$el.addClass('page');
            }

            switch (options.name) {
                case 'first':
                    this.$el.addClass('move-to-bottom');
                    break;
                case 'second':
                    this.$el.addClass('move-to-top');
                    break;
                default:
                    this.$el.addClass('move-to-bottom');
                    break;
            }

            return this;

        },

        transitionIn: function(callback) {

            var view = this,
                delay

            var transitionIn = function() {
                view.$el.addClass('is-visible');
                view.$el.on('transitionend', function() {
                    if (_.isFunction(callback)) {
                        callback();
                    }
                })
            };

            _.delay(transitionIn, 20);

        },

        transitionOut: function(callback) {

            var view = this;

            view.$el.removeClass('is-visible');
            view.$el.on('transitionend', function() {
                if (_.isFunction(callback)) {
                    callback();
                };
            });

        },

        bottomToTop: function(callback) {
            var view = this,
                delay

            view.$el.addClass('is-visible');
            view.$el.on('transitionend', function() {
                if (_.isFunction(callback)) {
                    callback();
                }
            })
        }

    });

    app.Views.App = app.Extensions.View.extend({

        el: 'body',

        goto: function(view) {

            var previous = this.currentPage || null;
            var next = view;

            if (previous) {
                previous.transitionOut(function() {
                    previous.remove();
                });
            }

            next.render({
                page: true,
                name: view.className
            });

            this.$el.append(next.$el);
            next.transitionIn();
            this.currentPage = next;

            $('button.btn').click(function() {

                event.preventDefault();
                event.stopPropagation();

                var href = $('div.page>p>a').attr('href');
                location.href = location.origin + '/' + href;

                return false;
            });


        }

    });

    app.Views.First = app.Extensions.View.extend({

        className: 'first',

        render: function() {

            var html = $('script[name=first]').html() + $('script[name=footer]').html();
            var template = _.template(html);

            this.$el.html(template());
            return app.Extensions.View.prototype.render.apply(this, arguments);
        }

    });

    app.Views.Second = app.Extensions.View.extend({

        className: 'second',

        render: function() {

            var html = $('script[name=second]').html() + $('script[name=footer]').html();
            var template = _.template(html);

            this.$el.html(template());
            return app.Extensions.View.prototype.render.apply(this, arguments);
        }

    });

}());
