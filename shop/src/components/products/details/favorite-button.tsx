// import { HeartFillIcon } from '@/components/icons/heart-fill';
// import { HeartOutlineIcon } from '@/components/icons/heart-outline';
// import Spinner from '@/components/ui/loaders/spinner/spinner';
// import { useModalAction } from '@/components/ui/modal/modal.context';
// import { useUser } from '@/framework/user';
// import { useToggleWishlist } from '@/framework/wishlist';
// import classNames from 'classnames';
// import { twMerge } from 'tailwind-merge';
// import { HeartGhostIcon } from '@/components/icons/heart-ghost';

// function FavoriteButton({
//   productId,
//   className,
//   variant = 'default',
// }: {
//   productId: string;
//   className?: string;
//   variant?: 'default' | 'minimal';
// }) {
//   const { isAuthorized } = useUser();
//   const { toggleWishlist, isLoading } = useToggleWishlist();
//   const { openModal } = useModalAction();

//   function toggle() {
//     if (!isAuthorized) {
//       openModal('LOGIN_VIEW');
//       return;
//     }
//     toggleWishlist({ shop_product_variant_id: productId });
//   }

//   if (isLoading) {
//     return (
//       <div
//         className={twMerge(
//           classNames(
//             'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300',
//             variant === 'minimal' ? 'bg-black bg-opacity-20' : '',
//             className
//           )
//         )}
//       >
//         <Spinner
//           simple
//           className={classNames(variant === 'default' ? 'h-5 w-5' : 'h-4 w-4')}
//         />
//       </div>
//     );
//   }

//   return (
//     <button
//       type="button"
//       className={twMerge(
//         classNames(
//           'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 text-xl text-accent transition-colors',
//           variant === 'minimal'
//             ? 'bg-black bg-opacity-20 text-white'
//             : '',
//           className
//         )
//       )}
//       onClick={toggle}
//     >
//       <>
//         {variant === 'default' ? <HeartOutlineIcon /> : <HeartGhostIcon />}
//       </>
//     </button>
//   );
// }

// export default FavoriteButton;


// === components/common/favorite-button.tsx (Your provided code) === 
import { HeartFillIcon } from '@/components/icons/heart-fill';
import { HeartOutlineIcon } from '@/components/icons/heart-outline';
import Spinner from '@/components/ui/loaders/spinner/spinner';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useUser } from '@/framework/user';
import {
  useInWishlist,
  useToggleWishlist,
} from '@/framework/wishlist';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import { HeartGhostIcon } from '@/components/icons/heart-ghost';

type Props = {
  productId: string;
  className?: string;
  variant?: 'default' | 'minimal';
};

const FavoriteButton = ({
  productId,
  className,
  variant = 'default',
}: Props) => {
  const { isAuthorized } = useUser();
  const { toggleWishlist, isLoading: toggling } = useToggleWishlist();
  const { inWishlist, isLoading: checking } = useInWishlist({
    enabled: isAuthorized,
    shop_product_variant_id: productId,
  });
  const { openModal } = useModalAction();

  const handleClick = () => {
    if (!isAuthorized) {
      openModal('LOGIN_VIEW');
      return;
    }
    toggleWishlist({ shop_product_variant_id: productId });
  };

  const isLoading = toggling || checking;

  if (isLoading) {
    return (
      <div
        className={twMerge(
          classNames(
            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
            variant === 'minimal' ? 'bg-black bg-opacity-20' : 'border-gray-300',
            className
          )
        )}
      >
        <Spinner
          simple
          className={classNames(variant === 'default' ? 'h-5 w-5' : 'h-4 w-4')}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={twMerge(
        classNames(
          'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xl transition-colors',
          inWishlist ? 'border-accent text-accent' : 'border-gray-300 text-accent',
          variant === 'minimal'
            ? inWishlist
              ? 'bg-accent text-white'
              : 'bg-black bg-opacity-20 text-white'
            : '',
          className
        )
      )}
    >
      <>
        {variant === 'default' ? (
          inWishlist ? (
            <HeartFillIcon />
          ) : (
            <HeartOutlineIcon />
          )
        ) : (
          <HeartGhostIcon />
        )}
      </>
    </button>
  );
};

export default FavoriteButton;
