describe('HomeCtrl', function() {

  beforeEach(module('aDoro'));
  var scope, template;

  beforeEach(inject(function($rootScope, $compile, $templateCache) {
    scope = $rootScope.new();
    template = $compile($templateCache.get('script/controllers/WorkCtrl.js'))(scope);
    setFixtures(template);
  }))

  describe('init', function() {
    it('should be in DOM', function() {
      expect(template).toBeInDOM();
    });
  });
});