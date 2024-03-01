import { Card, Container, Stack, Typography } from "@mui/material"

const CreateEvent = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Créer un événement
            </Typography>
            <form>
                <Stack spacing={2}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Informations générales
                        </Typography>
                    </Card>

                    <Card sx={{ p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Images
                        </Typography>

                        
                    </Card>
                </Stack>
            </form>
        </Container>
    )
}

export default CreateEvent;