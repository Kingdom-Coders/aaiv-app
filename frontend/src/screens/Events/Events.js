import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, 
    VStack, 
    HStack, 
    Button, 
    Text, 
    Heading, 
    Spinner,
    Badge,
    Dialog,
    Separator,
    Input,
    Textarea,
    Switch
} from '@chakra-ui/react';
import { 
    MdAdd, 
    MdEvent, 
    MdLocationOn, 
    MdSchedule, 
    MdPendingActions,
    MdCheck,
    MdClose,
    MdCalendarToday
} from 'react-icons/md';
import { FaCalendarAlt, FaCalendarPlus, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { 
    listEvents, 
    createEvent, 
    resetEventCreate,
    listPendingEvents,
    approveEvent,
    rejectEvent
} from '../../actions/eventActions';
import './Events.css';

const Events = () => {
    const dispatch = useDispatch();
    
    // Form state for creating new events
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedEventForRejection, setSelectedEventForRejection] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'pending'
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Redux state
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const eventList = useSelector((state) => state.eventList);
    const { loading: loadingEvents, events, error: errorEvents } = eventList;

    const eventCreate = useSelector((state) => state.eventCreate);
    const { loading: loadingCreate, success: successCreate, error: errorCreate, message: createMessage } = eventCreate;

    const eventPendingList = useSelector((state) => state.eventPendingList);
    const { loading: loadingPending, events: pendingEvents, error: errorPending } = eventPendingList;

    const eventApprove = useSelector((state) => state.eventApprove);
    const { loading: loadingApprove, success: successApprove } = eventApprove;

    const eventReject = useSelector((state) => state.eventReject);
    const { loading: loadingReject, success: successReject } = eventReject;

    // Load events on component mount
    useEffect(() => {
        dispatch(listEvents());
        if (userInfo && userInfo.isAdmin) {
            dispatch(listPendingEvents());
        }
    }, [dispatch, userInfo]);

    // Handle successful event creation
    useEffect(() => {
        if (successCreate) {
            // Reset form
            setTitle('');
            setDescription('');
            setLocation('');
            setStartDate('');
            setStartTime('');
            setEndDate('');
            setEndTime('');
            setIsAllDay(false);
            
            // Close the modal
            setIsCreateModalOpen(false);
            
            // Refresh events list
            dispatch(listEvents());
            if (userInfo && userInfo.isAdmin) {
                dispatch(listPendingEvents());
            }
            
            // Reset create state after a delay
            setTimeout(() => {
                dispatch(resetEventCreate());
            }, 3000);
        }
    }, [successCreate, dispatch, userInfo]);

    // Refresh lists after approval/rejection
    useEffect(() => {
        if (successApprove || successReject) {
            dispatch(listEvents());
            dispatch(listPendingEvents());
        }
    }, [successApprove, successReject, dispatch]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !description || !location || !startDate || !endDate) {
            alert('Please fill in all required fields');
            return;
        }

        // Combine date and time
        let startDateTime, endDateTime;

        if (isAllDay) {
            startDateTime = new Date(startDate);
            endDateTime = new Date(endDate);
            // Set to start and end of day
            startDateTime.setHours(0, 0, 0, 0);
            endDateTime.setHours(23, 59, 59, 999);
        } else {
            if (!startTime || !endTime) {
                alert('Please specify start and end times');
                return;
            }
            startDateTime = new Date(`${startDate}T${startTime}`);
            endDateTime = new Date(`${endDate}T${endTime}`);
        }

        const eventData = {
            title,
            description,
            location,
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            isAllDay
        };

        dispatch(createEvent(eventData));
    };

    // Handle event approval
    const handleApprove = (eventId) => {
        dispatch(approveEvent(eventId));
    };

    // Handle event rejection
    const handleReject = () => {
        if (!selectedEventForRejection) return;
        
        dispatch(rejectEvent(selectedEventForRejection, rejectionReason));
        setSelectedEventForRejection(null);
        setRejectionReason('');
    };

    // Format date and time for display
    const formatEventDate = (event) => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        if (event.isAllDay) {
            if (start.toDateString() === end.toDateString()) {
                return start.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                });
            } else {
                return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
            }
        } else {
            if (start.toDateString() === end.toDateString()) {
                return `${start.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                })} ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            } else {
                return `${start.toLocaleString()} - ${end.toLocaleString()}`;
            }
        }
    };

    return (
        <Box
            minH="100vh"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={5}
            pb="120px"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
            <VStack spacing={6} maxW="1200px" mx="auto">
                {/* Header */}
                <Box textAlign="center" mt={4}>
                    <Heading
                        size="2xl"
                        color="white"
                        fontWeight="600"
                        textShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                    >
                        🎉 Events
                    </Heading>
                    <Box w="200px" h="2px" bg="white" mx="auto" mt={2} opacity={0.8} />
                    <Text color="white" opacity={0.9} mt={2} fontSize="md">
                        Discover and create community events
                    </Text>
                </Box>

                {/* Tab Navigation for Admins */}
                {userInfo && userInfo.isAdmin && (
                    <HStack spacing={4}>
                        <Button
                            onClick={() => setActiveTab('upcoming')}
                            bg={activeTab === 'upcoming' ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.2)"}
                            color={activeTab === 'upcoming' ? "gray.700" : "white"}
                            leftIcon={<FaCalendarAlt />}
                            _hover={{
                                bg: activeTab === 'upcoming' ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.3)"
                            }}
                        >
                            Upcoming Events
                        </Button>
                        <Button
                            onClick={() => setActiveTab('pending')}
                            bg={activeTab === 'pending' ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.2)"}
                            color={activeTab === 'pending' ? "gray.700" : "white"}
                            leftIcon={<MdPendingActions />}
                            _hover={{
                                bg: activeTab === 'pending' ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.3)"
                            }}
                        >
                            Pending Requests ({pendingEvents?.length || 0})
                        </Button>
                    </HStack>
                )}

                {/* Create Event Button */}
                <Dialog.Root open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <Dialog.Trigger>
                        <Button
                            leftIcon={<MdAdd />}
                            bg="rgba(255, 255, 255, 0.9)"
                            color="gray.700"
                            size="lg"
                            borderRadius="12px"
                            boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
                            _hover={{
                                bg: "rgba(255, 255, 255, 1)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
                            }}
                            transition="all 0.3s ease"
                        >
                            ➕ Create New Event
                        </Button>
                    </Dialog.Trigger>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content maxW="600px" borderRadius="16px">
                            <Dialog.CloseTrigger />
                            <Dialog.Header>
                                <Dialog.Title>
                                    <HStack spacing={3}>
                                        <FaCalendarPlus color="#667eea" />
                                        <Text>Create New Event</Text>
                                    </HStack>
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <form onSubmit={handleSubmit}>
                                    <VStack spacing={4} align="stretch">
                                        {/* Success/Error Messages */}
                                        {successCreate && (
                                            <Box
                                                bg="green.50"
                                                border="1px solid"
                                                borderColor="green.200"
                                                borderRadius="8px"
                                                p={3}
                                            >
                                                <Text color="green.700" fontSize="sm" fontWeight="500">
                                                    {createMessage}
                                                </Text>
                                            </Box>
                                        )}

                                        {errorCreate && (
                                            <Box
                                                bg="red.50"
                                                border="1px solid"
                                                borderColor="red.200"
                                                borderRadius="8px"
                                                p={3}
                                            >
                                                <Text color="red.700" fontSize="sm" fontWeight="500">
                                                    {errorCreate}
                                                </Text>
                                            </Box>
                                        )}

                                        {/* Title */}
                                        <Box>
                                            <Text mb={2} fontWeight="500">Event Title *</Text>
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter event title"
                                                required
                                            />
                                        </Box>

                                        {/* Location */}
                                        <Box>
                                            <Text mb={2} fontWeight="500">Location *</Text>
                                            <Input
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Enter event location"
                                                required
                                            />
                                        </Box>

                                        {/* All Day Toggle */}
                                        <HStack justify="space-between" align="center">
                                            <Text fontWeight="500">All Day Event</Text>
                                            <Switch.Root
                                                checked={isAllDay}
                                                onCheckedChange={(e) => setIsAllDay(e.checked)}
                                            >
                                                <Switch.HiddenInput />
                                                <Switch.Control />
                                            </Switch.Root>
                                        </HStack>

                                        <Separator />

                                        {/* Date and Time */}
                                        <VStack spacing={3} align="stretch">
                                            <Text fontWeight="500">Date & Time *</Text>
                                            
                                            {/* Start Date/Time */}
                                            <HStack spacing={3}>
                                                <Box flex={1}>
                                                    <Text mb={1} fontSize="sm" color="gray.600">Start Date</Text>
                                                    <Input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        required
                                                    />
                                                </Box>
                                                {!isAllDay && (
                                                    <Box flex={1}>
                                                        <Text mb={1} fontSize="sm" color="gray.600">Start Time</Text>
                                                        <Input
                                                            type="time"
                                                            value={startTime}
                                                            onChange={(e) => setStartTime(e.target.value)}
                                                            required={!isAllDay}
                                                        />
                                                    </Box>
                                                )}
                                            </HStack>

                                            {/* End Date/Time */}
                                            <HStack spacing={3}>
                                                <Box flex={1}>
                                                    <Text mb={1} fontSize="sm" color="gray.600">End Date</Text>
                                                    <Input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        required
                                                    />
                                                </Box>
                                                {!isAllDay && (
                                                    <Box flex={1}>
                                                        <Text mb={1} fontSize="sm" color="gray.600">End Time</Text>
                                                        <Input
                                                            type="time"
                                                            value={endTime}
                                                            onChange={(e) => setEndTime(e.target.value)}
                                                            required={!isAllDay}
                                                        />
                                                    </Box>
                                                )}
                                            </HStack>
                                        </VStack>

                                        <Separator />

                                        {/* Description */}
                                        <Box>
                                            <Text mb={2} fontWeight="500">Description *</Text>
                                            <Textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Describe your event..."
                                                rows={4}
                                                required
                                            />
                                        </Box>

                                        {/* Submit Button */}
                                        <HStack justify="flex-end" spacing={3} pt={4}>
                                            <Button 
                                                variant="outline"
                                                onClick={() => setIsCreateModalOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                color="white"
                                                isLoading={loadingCreate}
                                                loadingText="Creating..."
                                                _hover={{
                                                    transform: "translateY(-1px)",
                                                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
                                                }}
                                            >
                                                {userInfo?.isAdmin ? 'Create Event' : 'Submit Request'}
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </form>
                            </Dialog.Body>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>

                {/* Content based on active tab */}
                {(!userInfo?.isAdmin || activeTab === 'upcoming') && (
                    <>
                        {/* Upcoming Events Section */}
                        {loadingEvents ? (
                            <Box
                                bg="rgba(255, 255, 255, 0.95)"
                                borderRadius="16px"
                                p={8}
                                w="100%"
                                maxW="800px"
                                textAlign="center"
                            >
                                <VStack spacing={4}>
                                    <Spinner size="lg" color="#667eea" />
                                    <Text color="gray.600">Loading events...</Text>
                                </VStack>
                            </Box>
                        ) : errorEvents ? (
                            <Box
                                bg="rgba(255, 255, 255, 0.95)"
                                borderRadius="16px"
                                p={6}
                                w="100%"
                                maxW="800px"
                            >
                                <Text color="red.600" fontSize="sm" fontWeight="500">
                                    Error loading events: {errorEvents}
                                </Text>
                            </Box>
                        ) : (
                            <Box w="100%" maxW="800px">
                                {!events || events.length === 0 ? (
                                    <Box
                                        bg="rgba(255, 255, 255, 0.95)"
                                        borderRadius="16px"
                                        p={8}
                                        textAlign="center"
                                    >
                                        <VStack spacing={4}>
                                            <MdCalendarToday size={48} color="#667eea" />
                                            <Text color="gray.600" fontSize="lg" fontWeight="500">
                                                No upcoming events
                                            </Text>
                                            <Text color="gray.500" fontSize="sm">
                                                Check back later or create a new event!
                                            </Text>
                                        </VStack>
                                    </Box>
                                ) : (
                                    <VStack spacing={4}>
                                        {events.map((event) => (
                                            <Box
                                                key={event._id}
                                                w="100%"
                                                bg="rgba(255, 255, 255, 0.95)"
                                                borderRadius="16px"
                                                p={6}
                                                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                                                transition="all 0.3s ease"
                                                _hover={{
                                                    transform: "translateY(-2px)",
                                                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                                                }}
                                            >
                                                <VStack align="stretch" spacing={3}>
                                                    <HStack justify="space-between" align="flex-start">
                                                        <Heading size="md" color="gray.800">
                                                            {event.title}
                                                        </Heading>
                                                        <Badge
                                                            bg="green.50"
                                                            color="green.700"
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            fontSize="xs"
                                                        >
                                                            {event.isAllDay ? 'All Day' : 'Timed'}
                                                        </Badge>
                                                    </HStack>

                                                    <HStack spacing={4} color="gray.600">
                                                        <HStack spacing={2}>
                                                            <FaClock size={16} />
                                                            <Text fontSize="sm">
                                                                {formatEventDate(event)}
                                                            </Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <FaMapMarkerAlt size={16} />
                                                            <Text fontSize="sm">{event.location}</Text>
                                                        </HStack>
                                                    </HStack>

                                                    <Text color="gray.700" fontSize="sm">
                                                        {event.description}
                                                    </Text>

                                                    {event.createdBy && (
                                                        <Text fontSize="xs" color="gray.500">
                                                            Created by {event.createdBy.firstName} {event.createdBy.lastName}
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                )}
                            </Box>
                        )}
                    </>
                )}

                {/* Pending Events Section (Admin Only) */}
                {userInfo?.isAdmin && activeTab === 'pending' && (
                    <>
                        {loadingPending ? (
                            <Box
                                bg="rgba(255, 255, 255, 0.95)"
                                borderRadius="16px"
                                p={8}
                                w="100%"
                                maxW="800px"
                                textAlign="center"
                            >
                                <VStack spacing={4}>
                                    <Spinner size="lg" color="#667eea" />
                                    <Text color="gray.600">Loading pending events...</Text>
                                </VStack>
                            </Box>
                        ) : errorPending ? (
                            <Box
                                bg="rgba(255, 255, 255, 0.95)"
                                borderRadius="16px"
                                p={6}
                                w="100%"
                                maxW="800px"
                            >
                                <Text color="red.600" fontSize="sm" fontWeight="500">
                                    Error loading pending events: {errorPending}
                                </Text>
                            </Box>
                        ) : (
                            <Box w="100%" maxW="800px">
                                {!pendingEvents || pendingEvents.length === 0 ? (
                                    <Box
                                        bg="rgba(255, 255, 255, 0.95)"
                                        borderRadius="16px"
                                        p={8}
                                        textAlign="center"
                                    >
                                        <VStack spacing={4}>
                                            <MdPendingActions size={48} color="#667eea" />
                                            <Text color="gray.600" fontSize="lg" fontWeight="500">
                                                No pending event requests
                                            </Text>
                                            <Text color="gray.500" fontSize="sm">
                                                All event requests have been reviewed.
                                            </Text>
                                        </VStack>
                                    </Box>
                                ) : (
                                    <VStack spacing={4}>
                                        {pendingEvents.map((event) => (
                                            <Box
                                                key={event._id}
                                                w="100%"
                                                bg="rgba(255, 255, 255, 0.95)"
                                                borderRadius="16px"
                                                p={6}
                                                boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
                                                border="2px solid #fbbf24"
                                            >
                                                <VStack align="stretch" spacing={3}>
                                                    <HStack justify="space-between" align="flex-start">
                                                        <Heading size="md" color="gray.800">
                                                            {event.title}
                                                        </Heading>
                                                        <Badge
                                                            bg="yellow.50"
                                                            color="yellow.700"
                                                            px={3}
                                                            py={1}
                                                            borderRadius="full"
                                                            fontSize="xs"
                                                        >
                                                            Pending Review
                                                        </Badge>
                                                    </HStack>

                                                    <HStack spacing={4} color="gray.600">
                                                        <HStack spacing={2}>
                                                            <FaClock size={16} />
                                                            <Text fontSize="sm">
                                                                {formatEventDate(event)}
                                                            </Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <FaMapMarkerAlt size={16} />
                                                            <Text fontSize="sm">{event.location}</Text>
                                                        </HStack>
                                                    </HStack>

                                                    <Text color="gray.700" fontSize="sm">
                                                        {event.description}
                                                    </Text>

                                                    {event.createdBy && (
                                                        <Text fontSize="sm" color="gray.600">
                                                            Requested by {event.createdBy.firstName} {event.createdBy.lastName}
                                                        </Text>
                                                    )}

                                                    {/* Admin Actions */}
                                                    <HStack spacing={3} pt={3}>
                                                        <Button
                                                            size="sm"
                                                            bg="green.500"
                                                            color="white"
                                                            leftIcon={<MdCheck />}
                                                            onClick={() => handleApprove(event._id)}
                                                            isLoading={loadingApprove}
                                                            _hover={{
                                                                bg: "green.600",
                                                                transform: "translateY(-1px)"
                                                            }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        
                                                        <Dialog.Root>
                                                            <Dialog.Trigger>
                                                                <Button
                                                                    size="sm"
                                                                    bg="red.500"
                                                                    color="white"
                                                                    leftIcon={<MdClose />}
                                                                    onClick={() => setSelectedEventForRejection(event._id)}
                                                                    _hover={{
                                                                        bg: "red.600",
                                                                        transform: "translateY(-1px)"
                                                                    }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </Dialog.Trigger>
                                                            <Dialog.Backdrop />
                                                            <Dialog.Positioner>
                                                                <Dialog.Content>
                                                                    <Dialog.CloseTrigger />
                                                                    <Dialog.Header>
                                                                        <Dialog.Title>Reject Event Request</Dialog.Title>
                                                                    </Dialog.Header>
                                                                    <Dialog.Body>
                                                                        <VStack spacing={4} align="stretch">
                                                                            <Text>
                                                                                Please provide a reason for rejecting this event request:
                                                                            </Text>
                                                                            <Textarea
                                                                                value={rejectionReason}
                                                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                                                placeholder="Reason for rejection..."
                                                                                rows={3}
                                                                            />
                                                                            <HStack justify="flex-end" spacing={3}>
                                                                                <Dialog.CloseTrigger>
                                                                                    <Button variant="outline">Cancel</Button>
                                                                                </Dialog.CloseTrigger>
                                                                                <Button
                                                                                    bg="red.500"
                                                                                    color="white"
                                                                                    onClick={handleReject}
                                                                                    isLoading={loadingReject}
                                                                                    _hover={{ bg: "red.600" }}
                                                                                >
                                                                                    Reject Event
                                                                                </Button>
                                                                            </HStack>
                                                                        </VStack>
                                                                    </Dialog.Body>
                                                                </Dialog.Content>
                                                            </Dialog.Positioner>
                                                        </Dialog.Root>
                                                    </HStack>
                                                </VStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                )}
                            </Box>
                        )}
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default Events; 