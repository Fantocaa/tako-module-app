// resources/js/lib/routeHelpers.ts
import * as Routes from '@/routes';

/**
 * Try to resolve a "route group" (e.g. 'papi') from the generated wayfinder module.
 * Returns an object with methods like .index(), .create(), .edit(id) if available,
 * otherwise returns {}.
 */
export function resolveRouteGroup(name: string): any {
  const ns = Routes as any;

  // 1) default export object that contains the group
  if (ns.default && typeof ns.default === 'object') {
    if (ns.default[name]) return ns.default[name];
    // if default itself *is* the group (e.g. default === papi)
    const defaultKeys = Object.keys(ns.default || {});
    if (defaultKeys.length && defaultKeys.includes('index') && defaultKeys.includes('create')) {
      return ns.default;
    }
  }

  // 2) named export "papi" (object)
  if (ns[name] && typeof ns[name] === 'object') return ns[name];

  // 3) named exports top-level like index/create (module is the group)
  //    If file exports top-level index/create, we return ns itself
  if (typeof ns.index === 'function' || typeof ns.create === 'function') return ns;

  // 4) try to collect names that start with the group prefix, e.g. papiIndex / papiCreate
  const result: any = {};
  Object.keys(ns).forEach((k) => {
    if (k.toLowerCase().startsWith(name.toLowerCase())) {
      // e.g. "papiIndex" -> prop "index"
      const suffix = k.slice(name.length);
      const prop = suffix ? suffix.charAt(0).toLowerCase() + suffix.slice(1) : 'index';
      result[prop] = ns[k];
    }
  });
  if (Object.keys(result).length) return result;

  // 5) nothing found
  return {};
}
