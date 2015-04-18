import test from 'tape';
import cssClassnamer from '../src/cssClassnamer';

test('cssClassnamer with no arguments', t => {
  cssClassnamer.init();
  t.equal(cssClassnamer.namespace, undefined, 'undefined namespace');
  t.equal(cssClassnamer.componentName, 'AriaMenuButton', 'default componentName');
  t.equal(cssClassnamer.componentPart('baz'), 'AriaMenuButton-baz', 'componentPart');
  t.equal(cssClassnamer.componentPart('baz--poo'), 'AriaMenuButton-baz--poo',
    'componentPart with modifier');
  t.equal(cssClassnamer.applyNamespace('is-baz'), 'is-baz', 'state');
  t.end();
});

test('cssClassnamer with componentName only', t => {
  cssClassnamer.init('foo');
  t.equal(cssClassnamer.namespace, undefined, 'undefined namespace');
  t.equal(cssClassnamer.componentName, 'foo', 'componentName');
  t.equal(cssClassnamer.componentPart('baz'), 'foo-baz', 'componentPart');
  t.equal(cssClassnamer.componentPart('baz--poo'), 'foo-baz--poo',
    'componentPart with modifier');
  t.equal(cssClassnamer.applyNamespace('is-baz'), 'is-baz', 'state');
  t.end();
});

test('cssClassnamer with namespace only', t => {
  cssClassnamer.init(undefined, 'foo');
  t.equal(cssClassnamer.namespace, 'foo', 'bare namespace');
  t.equal(cssClassnamer.componentName, 'foo-AriaMenuButton', 'default componentName');
  t.equal(cssClassnamer.componentPart('baz'), 'foo-AriaMenuButton-baz', 'componentPart');
  t.equal(cssClassnamer.componentPart('baz--poo'), 'foo-AriaMenuButton-baz--poo',
    'componentPart with modifier');
  t.equal(cssClassnamer.applyNamespace('is-baz'), 'foo-is-baz', 'state');
  t.end();
});

test('cssClassnamer with both arguments', t => {
  cssClassnamer.init('foo', 'bar');
  t.equal(cssClassnamer.namespace, 'bar', 'bare namespace');
  t.equal(cssClassnamer.componentName, 'bar-foo', 'bare componentName');
  t.equal(cssClassnamer.componentPart('baz'), 'bar-foo-baz', 'componentPart');
  t.equal(cssClassnamer.componentPart('baz--poo'), 'bar-foo-baz--poo',
    'componentPart with modifier');
  t.equal(cssClassnamer.applyNamespace('is-baz'), 'bar-is-baz', 'state');
  t.end();
});
