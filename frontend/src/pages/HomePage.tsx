import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Container,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    People as PeopleIcon,
    School as SchoolIcon,
    EventNote as EventNoteIcon,
    EmojiPeople as EmojiPeopleIcon,
    StarRate as StarRateIcon,
    Forum as ForumIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchMentors } from '../store/mentorsSlice';
import Layout from '../components/common/Layout';
import MentorCard from '../components/mentors/MentorCard';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { mentors } = useSelector((state: RootState) => state.mentors);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchMentors());
    }, [dispatch]);

    const featuredMentors = mentors.slice(0, 3);

    return (
        <Layout>
            {/* Hero Section */ }
            <Box
                sx={ {
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 8,
                    borderRadius: 2,
                    textAlign: 'center',
                    mb: 6
                } }
            >
                <Container maxWidth="md">
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Free Mentors
                    </Typography>
                    <Typography variant="h5" gutterBottom fontWeight="normal">
                        Connect with experienced professionals for free mentorship
                    </Typography>
                    <Typography variant="body1" paragraph sx={ { mt: 2, mb: 4, maxWidth: 700, mx: 'auto' } }>
                        Free Mentors is a social initiative where accomplished professionals become role models to young people to provide free mentorship sessions. Get guidance, advice, and support from experts in various fields.
                    </Typography>
                    <Box sx={ { mt: 4 } }>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={ () => navigate('/mentors') }
                            sx={ {
                                mr: 2,
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            } }
                        >
                            Find a Mentor
                        </Button>
                        { !isAuthenticated && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                onClick={ () => navigate('/auth/signup') }
                                sx={ {
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                } }
                            >
                                Join Now
                            </Button>
                        ) }
                    </Box>
                </Container>
            </Box>

            {/* How It Works Section */ }
            <Box sx={ { mb: 6 } }>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    How It Works
                </Typography>
                <Typography
                    variant="body1"
                    paragraph
                    align="center"
                    sx={ { mb: 4, maxWidth: 700, mx: 'auto' } }
                >
                    Free Mentors connects individuals seeking guidance with experienced professionals willing to share their knowledge and expertise.
                </Typography>

                <Stack direction={ { xs: 'column', md: 'row' } } spacing={ 3 }>
                    <Box sx={ { flex: 1, width: '100%' } }>
                        <Paper sx={ { p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
                            <PeopleIcon color="primary" sx={ { fontSize: 60, mb: 2 } } />
                            <Typography variant="h6" gutterBottom align="center">
                                Find a Mentor
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Browse through our diverse pool of experienced mentors from various fields.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box sx={ { flex: 1, width: '100%' } }>
                        <Paper sx={ { p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
                            <EventNoteIcon color="primary" sx={ { fontSize: 60, mb: 2 } } />
                            <Typography variant="h6" gutterBottom align="center">
                                Request a Session
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Send a mentorship request with details about what you'd like to discuss.
                            </Typography>
                        </Paper>
                    </Box>
                    <Box sx={ { flex: 1, width: '100%' } }>
                        <Paper sx={ { p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
                            <SchoolIcon color="primary" sx={ { fontSize: 60, mb: 2 } } />
                            <Typography variant="h6" gutterBottom align="center">
                                Grow and Learn
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Gain insights, knowledge, and guidance to help you succeed in your journey.
                            </Typography>
                        </Paper>
                    </Box>
                </Stack>
            </Box>

            {/* Featured Mentors Section */ }
            <Box sx={ { mb: 6 } }>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Featured Mentors
                </Typography>
                <Typography
                    variant="body1"
                    paragraph
                    align="center"
                    sx={ { mb: 4, maxWidth: 700, mx: 'auto' } }
                >
                    Meet some of our highly rated mentors who are making a difference.
                </Typography>

                <Stack direction={ { xs: 'column', sm: 'row' } } spacing={ 3 } sx={ { flexWrap: { sm: 'wrap' } } }>
                    { featuredMentors.map(mentor => (
                        <Box key={ mentor.id } sx={ {
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.33% - 16px)' },
                            mb: { xs: 3, sm: 0 }
                        } }>
                            <MentorCard mentor={ mentor } />
                        </Box>
                    )) }
                </Stack>

                <Box sx={ { textAlign: 'center', mt: 4 } }>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={ () => navigate('/mentors') }
                    >
                        View All Mentors
                    </Button>
                </Box>
            </Box>

            {/* Benefits Section */ }
            <Box sx={ { mb: 6 } }>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    Benefits
                </Typography>

                <Stack
                    direction={ { xs: 'column', md: 'row' } }
                    spacing={ 4 }
                    alignItems="stretch"
                >
                    <Box sx={ { width: { xs: '100%', md: '50%' } } }>
                        <Paper sx={ { p: 4, height: '100%' } }>
                            <Typography variant="h5" gutterBottom color="primary">
                                For Mentees
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmojiPeopleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Personalized guidance from experienced professionals" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <SchoolIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Learn industry insights and best practices" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ForumIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="One-on-one sessions tailored to your needs" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <StarRateIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Completely free mentorship from top professionals" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                    <Box sx={ { width: { xs: '100%', md: '50%' } } }>
                        <Paper sx={ { p: 4, height: '100%' } }>
                            <Typography variant="h5" gutterBottom color="primary">
                                For Mentors
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmojiPeopleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Give back to the community through knowledge sharing" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <SchoolIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Build leadership and coaching skills" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <ForumIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Expand your professional network" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <StarRateIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Gain recognition for your expertise and contributions" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>
                </Stack>
            </Box>

            {/* Call To Action */ }
            <Box
                sx={ {
                    bgcolor: 'secondary.main',
                    color: 'white',
                    py: 6,
                    borderRadius: 2,
                    textAlign: 'center'
                } }
            >
                <Typography variant="h4" component="h2" gutterBottom>
                    Ready to Get Started?
                </Typography>
                <Typography variant="body1" paragraph sx={ { maxWidth: 700, mx: 'auto', mb: 4 } }>
                    Join our community today to connect with mentors or become a mentor yourself.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={ () => isAuthenticated ? navigate('/mentors') : navigate('/auth/signup') }
                    sx={ {
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                    } }
                >
                    { isAuthenticated ? 'Explore Mentors' : 'Join Free Mentors' }
                </Button>
            </Box>
        </Layout>
    );
};

export default HomePage;