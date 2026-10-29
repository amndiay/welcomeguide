-- Published guides are publicly readable
GRANT SELECT ON public.guides TO anon;
GRANT SELECT ON public.guide_sections TO anon;
GRANT SELECT ON public.guide_blocks TO anon;
GRANT SELECT ON public.recommendations TO anon;
GRANT SELECT ON public.properties TO anon;
GRANT INSERT ON public.analytics_events TO anon;

CREATE POLICY "public read published guides"
ON public.guides FOR SELECT TO anon
USING (status = 'published');

CREATE POLICY "public read published guide sections"
ON public.guide_sections FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM public.guides g
  WHERE g.id = guide_sections.guide_id AND g.status = 'published'
));

CREATE POLICY "public read published guide blocks"
ON public.guide_blocks FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM public.guide_sections s
  JOIN public.guides g ON g.id = s.guide_id
  WHERE s.id = guide_blocks.section_id AND g.status = 'published'
));

CREATE POLICY "public read properties of published guides"
ON public.properties FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM public.guides g
  WHERE g.property_id = properties.id AND g.status = 'published'
));

CREATE POLICY "public read recommendations of published guides"
ON public.recommendations FOR SELECT TO anon
USING (EXISTS (
  SELECT 1 FROM public.guides g
  WHERE g.property_id = recommendations.property_id AND g.status = 'published'
));

CREATE POLICY "public insert guide analytics"
ON public.analytics_events FOR INSERT TO anon
WITH CHECK (
  guide_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.guides g
    WHERE g.id = analytics_events.guide_id AND g.status = 'published'
  )
);