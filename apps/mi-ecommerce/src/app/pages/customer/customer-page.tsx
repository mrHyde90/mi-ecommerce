// apps/storefront/src/app/routes/cart/cart-page.tsx
import { useParams } from 'react-router-dom';
import { ProfileData } from '@mi-ecommerce/customer-module';

export function CustomerPage() {
	const { cartId } = useParams<{ cartId: string }>();
	return (
		<div className="page">
			<h1>Your profile</h1>
			<ProfileData cartId={cartId!} />
		</div>
	);
}