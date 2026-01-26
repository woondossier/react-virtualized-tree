import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('arg1');
  });

  it('should reset timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    vi.advanceTimersByTime(50);

    debounced('second');
    vi.advanceTimersByTime(50);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('should cancel pending execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1');
    vi.advanceTimersByTime(50);

    debounced.cancel();
    vi.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
  });

  it('should handle multiple arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2', 'arg3');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });

  it('should allow multiple independent debounced calls after timeout', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('first');

    debounced('second');
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('second');
  });

  it('should handle cancel when no pending timeout', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    // Cancel without any pending call - should not throw
    expect(() => debounced.cancel()).not.toThrow();

    // Cancel after timeout completed
    debounced('arg1');
    vi.advanceTimersByTime(100);
    expect(() => debounced.cancel()).not.toThrow();
  });

  it('should work with zero delay', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 0);

    debounced('arg1');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledWith('arg1');
  });
});
