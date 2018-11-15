/**
 * JQuery плагин-обёртка для создания другого Jquery плагина с именем pluginName, который в свою очередь является
 * proxy для объекта wrappedObject
 *
 * Плагин сделан для того, чтобы не дублировать интерфейс взаимодействия с объектом wrappedObject в каждом создаваемом плагине
 *
 * @author Egor Serikov
 */
;(function ( $, window, undefined ) {

    var curPluginName = 'pluginInit';

    /**
     *
     * @param pluginName Имя создаваемого плагина
     * @param wrappedObject Объект, к которому будет являться proxy создаваемый плагин
     * @returns {Array}
     */
    $.fn[curPluginName] = function ( pluginName, wrappedObject ) {

        // Проверка корректности аргумента
        if (!pluginName || $.trim(pluginName) == '')
        {
            throw new Error(curPluginName + ': empty plugin name');
        }

        if (typeof wrappedObject != 'function')
        {
            throw new Error(curPluginName + ': Incorrect wrappedObject for plugin ' + pluginName);
        }

        // Создаём плагин
        $.fn[pluginName] = function () {

            var pluginArgs = arguments,
                method = pluginArgs[0], // Метод, вызываемый для плагина
                res = [], // Результат вызова метода
                isMultiSelector = (this.length > 1); // Был ли плагин применён к нескольким селекторам

            // Проходимся по переданным селекторам
            this.each(function () {

                // Если объект для даннного селектора не был создан, создаём его с переданным аргументом
                var obj = (!$(this).data('plugin_' + pluginName)) ? $(this).data('plugin_' + pluginName, new wrappedObject( this, method )) : $(this).data('plugin_' + pluginName);

                // Если запрошен метод объекта

                console.log(method);
                console.log(obj);
                if (typeof method != 'object' && method)
                {
                    // Если метод у объекта существует
                    if (typeof obj[method] == 'function')
                    {
                        // Вызываем метод
                        var curRes = obj[ method ].apply( obj, Array.prototype.slice.call( pluginArgs, 1 ));
                        // Если метод вернул результат
                        if (typeof curRes != 'undefined')
                        {
                            // Если плагин применён к нескольким селекторам, добавляем результат текущего метода в общий массив результата res
                            // Если плагин применён к 1 селектору, общим результатом вызова является текущий результат метода
                            (isMultiSelector) ? res.push(curRes) : res = curRes;
                        }
                    }
                    // Если метод у объекта отсутствует
                    else
                    {
                        console.log( 'Метод с именем ' +  method + ' не существует для '+ pluginName);
                    }
                }
            });

            // Возвращаем сформированный результат
            return res;
        }

    }
}(jQuery, window));
