# Task Checklist: ILovePDF-Style Simplification

- [ ] Plan the UI refactor to a flat design
- [ ] Remove the complex Neumorphic CSS engine from [globals.css](file:///d:/SENEVON/Toolit_1/frontend/src/app/globals.css) and [home2.css](file:///d:/SENEVON/Toolit_1/frontend/src/app/home2.css)
- [ ] Remove the dynamic Color Engine (Orb & Sliders) from the homepage
- [ ] Simplify [page.tsx](file:///d:/SENEVON/Toolit_1/frontend/src/app/page.tsx) by removing all `useMemo` color calculation and keeping only standard React state
- [ ] Refactor `.nm-tool-card`, `.calculator-card` and other key components to use a clean white background, simple borders, and traditional hover drop-shadows
- [ ] Update Navbar and Footer to use flat styling
- [ ] Ensure the 'All Tools' and specific Tool pages adopt the new flat architecture
