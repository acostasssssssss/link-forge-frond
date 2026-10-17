
ayudame a revisar en el frond me sale este error al hacer deploy en vercel 



src/components/UrlCard.tsx(37,3): error TS6133: 'index' is declared but its value is never read.
src/components/ui/Button.tsx(29,8): error TS2322: Type '{ children: (Element | ReactNode)[]; form?: string; formAction?: string | ((formData: FormData) => void | Promise<void>); formEncType?: string; ... 286 more ...; disabled: boolean; }' is not assignable to type 'Omit<HTMLMotionProps<"button">, "ref">'.
  Types of property 'onDrag' are incompatible.
    Type 'DragEventHandler<HTMLButtonElement>' is not assignable to type '(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void'.
      Types of parameters 'event' and 'event' are incompatible.
        Type 'MouseEvent | TouchEvent | PointerEvent' is not assignable to type 'DragEvent<HTMLButtonElement>'.
          Type 'MouseEvent' is missing the following properties from type 'DragEvent<HTMLButtonElement>': dataTransfer, nativeEvent, isDefaultPrevented, isPropagationStopped, persist
src/pages/Home.tsx(22,61): error TS6133: 'loadingList' is declared but its value is never read.
src/pages/Manage.tsx(21,8): error TS2724: '"../lib/api"' has no exported member named 'Analytics'. Did you mean 'getAnalytics'?
src/pages/Manage.tsx(80,26): error TS2322: Type 'unknown' is not assignable to type 'string'.
src/pages/Manage.tsx(80,43): error TS2322: Type 'unknown' is not assignable to type 'string'.
src/pages/Manage.tsx(104,26): error TS2322: Type 'unknown' is not assignable to type 'string'.
tsconfig.app.json(22,5): error TS5023: Unknown compiler option 'erasableSyntaxOnly'.
error TS2688: Cannot find type definition file for 'node'.
  The file is in the program because:
    Entry point of type library 'node' specified in compilerOptions
tsconfig.node.json(19,5): error TS5023: Unknown compiler option 'erasableSyntaxOnly'.
Error: [BUILD_UTILS_SPAWN_1] Command "npm run build" exited with 1