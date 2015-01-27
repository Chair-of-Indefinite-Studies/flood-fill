describe('Flood Fill', function(){
    it('should depend on sprite', function(){
        expect(sprite).toBeDefined();
    });

    it('should depend on sprite.editor', function(){
        expect(sprite.editor).toBeDefined();
    });

    describe('act upon sprite.editor.Model', function(){
        var model;

        beforeEach(function(){
            model = new sprite.editor.Model(10, 10);
        });

        it('that exist', function(){
            expect(model).toBeDefined();
        });

        describe('and fill', function(){
            var division = 5;

            beforeEach(function(){
                for (var column = 0; column < model.columns; column++) {
                    model.paintPixel(column, division);
                }
                for (var row = 0; row < model.rows; row++) {
                    model.paintPixel(division, row);
                }
            });

            it('upper left connected region with the brush color', function(){
                var flooder = new sprite.flood.fill.Flooder(model);

                flooder.flood(0, 0);

                for (var column = 0; column < division; column++) {
                    for (var row = 0; row < division; row++) {
                        expect(model.colorAt(column, row)).toEqual('black');
                    }
                }
             });

            it('upper right connected region with the brush color', function(){
                var flooder = new sprite.flood.fill.Flooder(model);

                flooder.flood(model.columns - 1, 0);

                for (var column = division + 1; column < model.columns; column++) {
                    for (var row = 0; row < division; row++) {
                        expect(model.colorAt(column, row)).toEqual('black');
                    }
                }
             });

            it('lower left connected region with the brush color', function(){
                var flooder = new sprite.flood.fill.Flooder(model);

                flooder.flood(0, model.rows - 1);

                for (var column = 0; column < division; column++) {
                    for (var row = division + 1; row < model.rows; row++) {
                        expect(model.colorAt(column, row)).toEqual('black');
                    }
                }
             });

            it('lower right connected region with the brush color', function(){
                var flooder = new sprite.flood.fill.Flooder(model);

                flooder.flood(model.columns - 1, model.rows - 1);

                for (var column = division + 1; column < model.columns; column++) {
                    for (var row = division + 1; row < model.rows; row++) {
                        expect(model.colorAt(column, row)).toEqual('black');
                    }
                }
             });
        });
    });
});
