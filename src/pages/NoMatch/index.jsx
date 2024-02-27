import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss';

const NoMatch = () => {
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	const { pathname } = useLocation();

	useEffect(()=> {
		console.log(pathname);
		if (!user.isLogged && (pathname !== '/' || pathname !== '/signup')) {
			navigate('/')
		}
	}, [pathname, user, navigate])

	return (
		<section className="nomatch flex_center padding">
			<div>
				<h1>Erreur 404</h1>
				<p>Cette page n'existe pas !</p>
			</div>
		</section>
	)
}

export default NoMatch;