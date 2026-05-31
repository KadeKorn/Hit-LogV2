import { PlaceholderScreen } from '@/components/navigation-shell/placeholder-screen';

export default function LibraryScreen() {
  return (
    <PlaceholderScreen
      eyebrow="Library"
      title="Template Library"
      intro="Browse and manage training structure here before an active routine exists."
      sections={[
        {
          title: 'Prebuilt Templates',
          body: 'Evidence-based routines will live here for browsing, duplication, and activation.',
        },
        {
          title: 'Custom Templates',
          body: 'User-created routines will appear here once template creation is implemented.',
        },
        {
          title: 'Best Practices',
          body: 'Training guidance, setup notes, and template explanations will be grouped here.',
        },
      ]}
    />
  );
}
