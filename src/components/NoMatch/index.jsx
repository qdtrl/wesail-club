import { Card, Container, Stack, Typography } from '@mui/material';
import './index.scss';

const NoMatch = () => {
	return (
		<Container sx={{height: '98vh'}} maxWidth="sm">
			<Stack sx={{height: '90%'}} alignItems="center" justifyContent="center">
				<Card sx={{padding: '1rem 2rem'}} >
					<Stack direction="row" alignItems="baseline" gap={2}>
						<Typography variant="h1">
							404
						</Typography>
						<Typography variant="h4">
							Page non trouvée
						</Typography>
					</Stack>
				</Card>
			</Stack>
		</Container>
	)
}

export default NoMatch;