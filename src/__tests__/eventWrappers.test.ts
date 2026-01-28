import type { KeyboardEvent } from 'react';
import { wrapKeyDownEvent, KEYS, KEY_CODES, submitEvent } from '../eventWrappers';

describe('eventWrappers', () => {
  describe('wrapKeyDownEvent', () => {
    it('should call handler when key matches allowed keys', () => {
      const handler = vi.fn();
      const wrappedHandler = wrapKeyDownEvent([KEYS.Enter])(handler);

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when key does not match', () => {
      const handler = vi.fn();
      const wrappedHandler = wrapKeyDownEvent([KEYS.Enter])(handler);

      const event = {
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(event);

      expect(handler).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should work with multiple allowed keys', () => {
      const handler = vi.fn();
      const wrappedHandler = wrapKeyDownEvent([KEYS.Enter, KEYS.Space])(handler);

      const enterEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      const spaceEvent = {
        key: ' ',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(enterEvent);
      wrappedHandler(spaceEvent);

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should pass additional parameters to handler', () => {
      const handler = vi.fn();
      const wrappedHandler = wrapKeyDownEvent([KEYS.Enter])(handler);

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(event, 'param1', 'param2', 123);

      expect(handler).toHaveBeenCalledWith('param1', 'param2', 123);
    });

    it('should prevent default on matched key', () => {
      const handler = vi.fn();
      const wrappedHandler = wrapKeyDownEvent([KEYS.Tab])(handler);

      const event = {
        key: 'Tab',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('submitEvent', () => {
    it('should respond to Enter key', () => {
      const handler = vi.fn();
      const wrappedHandler = submitEvent(handler);

      const event = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(event);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should respond to Space key', () => {
      const handler = vi.fn();
      const wrappedHandler = submitEvent(handler);

      const event = {
        key: ' ',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(event);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not respond to other keys', () => {
      const handler = vi.fn();
      const wrappedHandler = submitEvent(handler);

      const event = {
        key: 'a',
        preventDefault: vi.fn(),
      } as unknown as KeyboardEvent;

      wrappedHandler(event);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('KEYS constant', () => {
    it('should have correct key values', () => {
      expect(KEYS.Enter).toBe('Enter');
      expect(KEYS.Space).toBe(' ');
      expect(KEYS.Escape).toBe('Escape');
      expect(KEYS.ArrowUp).toBe('ArrowUp');
      expect(KEYS.ArrowDown).toBe('ArrowDown');
      expect(KEYS.ArrowLeft).toBe('ArrowLeft');
      expect(KEYS.ArrowRight).toBe('ArrowRight');
      expect(KEYS.Tab).toBe('Tab');
      expect(KEYS.Backspace).toBe('Backspace');
      expect(KEYS.Delete).toBe('Delete');
    });
  });

  describe('KEY_CODES constant (deprecated)', () => {
    it('should have correct legacy key code values', () => {
      expect(KEY_CODES.Enter).toBe(13);
      expect(KEY_CODES.Escape).toBe(27);
      expect(KEY_CODES.Tab).toBe(9);
      expect(KEY_CODES.UpArrow).toBe(38);
      expect(KEY_CODES.DownArrow).toBe(40);
      expect(KEY_CODES.LeftArrow).toBe(37);
      expect(KEY_CODES.RightArrow).toBe(39);
    });
  });
});
