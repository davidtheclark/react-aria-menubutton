import test from 'tape';
import sinon from 'sinon';
import Manager from '../src/Manager';

test('Manager', t => {
  const testManager = new Manager();
  const firstItem = {
    node: { focus: sinon.spy() },
    text: 'first',
  };
  const secondItem = {
    node: { focus: sinon.spy() },
    content: 'second',
  };
  testManager.items = [firstItem, secondItem];
  testManager.trigger = {
    focus: sinon.spy(),
  };

  t.equal(testManager.currentFocus, -1);

  // moveFocus()
  testManager.moveFocus(1);
  t.equal(testManager.currentFocus, 1);
  t.ok(secondItem.node.focus.calledOnce);

  testManager.moveFocus(0);
  t.equal(testManager.currentFocus, 0);
  t.ok(firstItem.node.focus.calledOnce);

  firstItem.node.focus.reset();
  secondItem.node.focus.reset();

  // moveFocusUp()
  testManager.moveFocusUp();
  t.equal(testManager.currentFocus, 1);
  testManager.moveFocusUp();
  t.equal(testManager.currentFocus, 0);

  // moveFocusDown()
  testManager.moveFocusDown();
  t.equal(testManager.currentFocus, 1);
  testManager.moveFocusDown();
  t.equal(testManager.currentFocus, 0);

  firstItem.node.focus.reset();
  secondItem.node.focus.reset();

  // moveToLetter()
  testManager.currentFocus = -1;

  testManager.moveToLetter('f');
  t.equal(testManager.currentFocus, 0);
  t.ok(firstItem.node.focus.calledOnce);

  testManager.moveToLetter('s');
  t.equal(testManager.currentFocus, 1);
  t.ok(secondItem.node.focus.calledOnce);

  testManager.moveToLetter('f');
  t.equal(testManager.currentFocus, 0);
  t.ok(firstItem.node.focus.calledTwice);

  t.end();
});
