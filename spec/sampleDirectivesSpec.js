var compile, scope, directiveElem;

beforeEach(function(){
  module('sampleDirectives');
  
  inject(function($compile, $rootScope){
    compile = $compile;
    scope = $rootScope.$new();
  });
  
  directiveElem = getCompiledElement();
});

function getCompiledElement(){
  var element = angular.element('<div first-directive></div>');
  var compiledElement = compile(element)(scope);
  scope.$digest();
  return compiledElement;
}