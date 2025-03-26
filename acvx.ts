type Variants = { [key: string]: { [key: string]: string | string[] } };
type CompoundVariant = { [key: string]: string | string[] | boolean | number | null | undefined; class?: string; className?: string };

function ax(...args: (string | number | object | null | undefined)[]): string {
  let result = '';
  const stack = [...args];

  while (stack.length) {
    const arg = stack.pop();
    if (!arg) continue;

    if (typeof arg === 'string' || typeof arg === 'number') {
      result += arg.toString() + ' ';
      continue;
    }

    if (Array.isArray(arg)) {
      stack.push(...arg);
      continue;
    }

    if (typeof arg === 'object') {
      for (const key in arg as Record<string, any>) {
        const value = (arg as Record<string, any>)[key];
        if ((typeof value === 'function' ? value() : value)) {
          result += key + ' ';
        }
      }
    }
  }

  return result.trim();
}

interface AVConfig {
  variants?: Variants;
  defaults?: Record<string, any>;
  defaultVariants?: Record<string, any>;
  compoundVariants?: CompoundVariant[];
  compounds?: CompoundVariant[];
}

function av(base: string, config: AVConfig = {}) {
  const cache = new Map<string, string>();

  return Object.assign((props: Record<string, any> = {}): string => {
    const cacheKey = JSON.stringify(props);
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    const { variants = {}, defaults = {}, defaultVariants = {}, compoundVariants = [], compounds = [] } = config;
    const finalDefaults = { ...defaultVariants, ...defaults };
    const appliedVariants: string[] = [];

    for (const key in variants) {
      const selected = props[key] ?? finalDefaults[key];
    
      if (selected != null) {
        const value = variants[key][selected as keyof typeof variants[string]];
        if (value) appliedVariants.push(...(Array.isArray(value) ? value : [value]));
      }
    }

    const appliedCompoundVariants: string[] = [];
    
    for (const cv of [...compoundVariants, ...compounds]) {
      const { class: className, className: classNameAlt, ...conditions } = cv;
      let matches = true;
      
      for (const key in conditions) {
        const conditionValue = conditions[key];
        const currentValue = props[key] ?? finalDefaults[key];
      
        if (Array.isArray(conditionValue)) {
          if (!conditionValue.includes(currentValue)) {
            matches = false;
            break;
          }
        } else if (currentValue !== conditionValue) {
          matches = false;
          break;
        }
      }
      
      if (matches) appliedCompoundVariants.push(className || classNameAlt || "");
    }

    const result = ax(base, ...appliedVariants, ...appliedCompoundVariants);
    
    cache.set(cacheKey, result);

    if (cache.size > 99) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }

    return result;
  }, { clearCache: () => cache.clear() });
}
