import Input from '@/components/ui/input';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import FileInput from '@/components/ui/file-input';
import Checkbox from '@/components/ui/checkbox/checkbox';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import Alert from '@/components/ui/alert';
import { SettingsOptions } from '@/types';
import TextArea from '@/components/ui/text-area';

type IProps = {
  initialValues: any;
  settings: SettingsOptions | undefined;
};

export default function ProductInfo({ initialValues, settings }: IProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const isTranslateProduct = locale !== Config.defaultLanguage;

  // const is_digital = watch('is_digital');
  // const is_external = watch('is_external');
  const is_update_message = watch('inform_purchased_customer');

  return (
    <div className="my-5 flex flex-wrap sm:my-8">
      <Description
        title={t('form:form-title-simple-product-info')}
        details={`${
          initialValues
            ? t('form:item-description-edit')
            : t('form:item-description-add')
        } ${t('form:form-description-simple-product-info')}`}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={`${t('form:input-label-price')}*`}
          {...register('price')}
          type="number"
          error={t(errors.price?.message!)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={t('form:input-label-sale-price')}
          type="number"
          {...register('sale_price')}
          error={t(errors.sale_price?.message!)}
          variant="outline"
          className="mb-5"
        />

        <Input
          label={`${t('form:input-label-quantity')}*`}
          type="number"
          {...register('quantity')}
          error={t(errors.quantity?.message!)}
          variant="outline"
          className="mb-5"
          // Need discussion
          disabled={isTranslateProduct}
        />

        <Input
          label={`${t('form:input-label-sku')}*`}
          {...register('sku')}
          note={
            Config.enableMultiLang
              ? `${t('form:input-note-multilang-sku')}`
              : ''
          }
          error={t(errors.sku?.message!)}
          variant="outline"
          className="mb-5"
          disabled={isTranslateProduct}
        />
      </Card>
    </div>
  );
}
