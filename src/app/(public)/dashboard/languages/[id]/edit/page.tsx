import { EditLanguage } from "../../../../../../features/language/presentation/components/edit-langauge";

type EditLanguagePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLanguagePage({
  params,
}: EditLanguagePageProps) {
  const { id } = await params;

  return (
    <div className="max-w-3xl mx-auto rounded-md my-6 p-4">
      <EditLanguage id={id} />;
    </div>
  );
}
