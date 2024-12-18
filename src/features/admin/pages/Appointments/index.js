import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Select, Modal, Button, Typography, message } from "antd";
import { parseTimeRange } from "../../../../utils/timeHelpers";
import AppointmentModal from "./components/AppointmentModal";

const { Text } = Typography;
const { Option } = Select;

// Mock default therapist
const DEFAULT_THERAPIST = {
  id: "e2373f62-84d1-4dae-92aa-cf7b231f1f31",
  availableHours: {
    friday: "9-5",
    monday: "9-5",
    tuesday: "10-4",
    thursday: "10-3",
    wednesday: "9-5",
  },
  bio: "Specializes in child psychology",
  certifications: [
    {
      title: "Certified Cognitive Behavioral Therapist",
      issuer: "National Therapy Board",
      attachmentUrl: "https://example.com/certification/cbt.pdf",
      description: "Specialization in CBT.",
      expirationDate: "2025-06-01",
      issueDate: "2015-06-01",
    },
    {
      title: "Family Therapy Specialist",
      issuer: "Global Therapy Association",
      description: "Specialist in family and marriage counseling.",
      issueDate: "2018-03-15",
    },
  ],
  contactNumber: "+1234567890",
  dateOfBirth: "1995-06-15T00:00:00.000Z",
  experience: 5,
  languagesSpoken: ["Indonesian", "English"],
  profilePicture: "https://example.com/profiles/therapist123.jpg",
  specializations: {
    type: "CBT",
    focus: "Anxiety, Depression",
  },
  user: {
    id: "e2373f62-84d1-4dae-92aa-cf7b231f1f31",
    email: "therapist2+12@example.com",
    fullname: "Therapist Name",
    role: "Therapist",
    createdAt: "2024-12-12T19:00:04.764Z",
    updatedAt: "2024-12-12T19:00:04.764Z",
  },
  workAddress: "123 Wellness Lane, Cityville",
  // Example appointments array
  appointments: [
    {
      id: "1",
      clientId: "client-1",
      clientName: "John Smith",
      startTime: "2024-12-18T10:00:00Z",
      endTime: "2024-12-18T11:00:00Z",
      status: "SCHEDULED",
      createdAt: "2024-12-17T10:00:00Z",
    },
  ],
};

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AppointmentsPage = () => {
  const [selectedTherapist, setSelectedTherapist] = useState(DEFAULT_THERAPIST);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] =
    useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);




 

 

  const generateAvailableSlots = () => {
    if (!selectedTherapist?.availableHours) return [];

    const slots = [];
    const currentDate = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Generate slots for next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      
      const dayName = dayNames[date.getDay()];
      
      if (selectedTherapist.availableHours[dayName]) {
        const [startHour, endHour] = selectedTherapist.availableHours[dayName]
          .split('-')
          .map(Number);

        const adjustedEndHour = endHour < startHour ? endHour + 12 : endHour;
        
        for (let hour = startHour; hour < adjustedEndHour; hour++) {
          const slotStart = new Date(date);
          slotStart.setHours(hour, 0, 0, 0);
          
          const slotEnd = new Date(date);
          slotEnd.setHours(hour + 1, 0, 0, 0);
          
          const isBooked = selectedTherapist.appointments?.some(apt => {
            const aptStart = new Date(apt.startTime);
            return aptStart.getTime() === slotStart.getTime();
          });

          if (!isBooked) {
            const startTime = hour < 12 ? `${hour}:00 AM` : `${hour-12 || 12}:00 PM`;
            const endTime = (hour+1) < 12 ? `${hour+1}:00 AM` : `${(hour+1)-12 || 12}:00 PM`;
            
            slots.push({
              title: `Available (${startTime} - ${endTime})`,
              start: slotStart,
              end: slotEnd,
              type: "available"
            });
          }
        }
      }
    }
    return slots;
  };

  const handleSelectEvent = (event) => {
    if (event.type === "available") {
      // When clicking an available slot
      setSelectedSlot({
        start: event.start,
        end: event.end
      });
      setShowNewAppointmentDialog(true);
    } else if (event.type === "appointment") {
      // Show existing appointment details
      Modal.info({
        title: "Appointment Details",
        content: (
          <div className="space-y-4">
            <div>
              <Text strong>Client:</Text>
              <Text> {event.title}</Text>
            </div>
            <div>
              <Text strong>Date:</Text>
              <Text> {format(event.start, "PPP")}</Text>
            </div>
            <div>
              <Text strong>Time:</Text>
              <Text>
                {" "}
                {format(event.start, "p")} - {format(event.end, "p")}
              </Text>
            </div>
            <div>
              <Text strong>Status:</Text>
              <Text> {event.status}</Text>
            </div>
            <div>
              <Text strong>Therapist:</Text>
              <Text> {selectedTherapist.user.fullname}</Text>
            </div>
          </div>
        ),
        width: 500,
      });
    }
  };


// Inside AppointmentsPage component

const handleCreateAppointment = async (appointmentData) => {
  if (!selectedClient || !appointmentData) return;

  try {
    setLoading(true);
    const newAppointment = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      clientName: selectedClient.user.fullname,
      startTime: appointmentData.start.toISOString(),
      endTime: appointmentData.end.toISOString(),
      status: "SCHEDULED",
      createdAt: new Date().toISOString(),
    };

    // Check for booking conflicts
    const isTimeSlotTaken = selectedTherapist.appointments?.some(apt => {
      const aptStart = new Date(apt.startTime);
      return aptStart.getTime() === appointmentData.start.getTime();
    });

    if (isTimeSlotTaken) {
      message.error('This time slot is already booked');
      return;
    }

    // Add to therapist's appointments array
    setSelectedTherapist((prev) => ({
      ...prev,
      appointments: [...(prev.appointments || []), newAppointment],
    }));

    message.success("Appointment created successfully");
    setShowNewAppointmentDialog(false);
  } catch (error) {
    message.error("Failed to create appointment");
  } finally {
    setLoading(false);
  }
};

  // Mock clients for testing
  const MOCK_CLIENTS = [
    {
      id: "client-1",
      user: {
        id: "user-1",
        fullname: "John Smith",
        email: "john@example.com",
        role: "Client",
      },
    },
    {
      id: "client-2",
      user: {
        id: "user-2",
        fullname: "Jane Doe",
        email: "jane@example.com",
        role: "Client",
      },
    },
  ];

 
  
 
  
  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: "#1890ff", // antd primary blue for appointments
    };
  
    if (event.type === "available") {
      style.backgroundColor = "#52c41a"; // antd success green for available slots
    }
  
    if (event.status === "CANCELLED") {
      style.backgroundColor = "#f5222d"; // antd error red for cancelled
    }
  
    return { style };
  };


  const dayPropGetter = (date) => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    
    if (selectedTherapist?.availableHours[dayName]) {
      return {
        className: 'available-day',
        style: {
          backgroundColor: 'rgba(82, 196, 26, 0.1)', // Light green for available days
        }
      };
    }
    return {
      className: 'unavailable-day',
      style: {
        backgroundColor: 'rgba(245, 34, 45, 0.1)', // Light red for unavailable days
      }
    };
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Slot selected:', slotInfo);
    
    // Create a date from the clicked slot
    const selectedDate = new Date(slotInfo.start);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[selectedDate.getDay()];
  
    // Check if therapist works on this day
    if (!selectedTherapist?.availableHours[dayName]) {
      message.warning('Therapist is not available on this day');
      return;
    }
  
    // Parse the available hours for that day (e.g., "9-5" becomes { start: 9, end: 17 })
    const timeRange = selectedTherapist.availableHours[dayName];
    const [startHour, endHour] = timeRange.split('-').map(Number);
  
    // Convert endHour if it's in 12-hour format
    const adjustedEndHour = endHour < startHour ? endHour + 12 : endHour;
  
    // Create Date objects for the available time range
    const availableStart = new Date(selectedDate);
    availableStart.setHours(startHour, 0, 0, 0);
  
    const availableEnd = new Date(selectedDate);
    availableEnd.setHours(adjustedEndHour, 0, 0, 0);
  
    // Check if clicked time is within available hours
    if (selectedDate < availableStart || selectedDate >= availableEnd) {
      message.warning(`Available hours for ${dayName} are ${startHour}:00 AM - ${endHour}:00 PM`);
      return;
    }
  
    // Round to nearest hour
    const roundedStart = new Date(selectedDate);
    roundedStart.setMinutes(0, 0, 0);
  
    const roundedEnd = new Date(roundedStart);
    roundedEnd.setHours(roundedStart.getHours() + 1);
  
    // Check if slot is already booked
    const isBooked = selectedTherapist.appointments?.some(apt => {
      const aptStart = new Date(apt.startTime);
      return aptStart.getTime() === roundedStart.getTime();
    });
  
    if (isBooked) {
      message.warning('This time slot is already booked');
      return;
    }
  
    console.log('Setting slot:', {
      start: roundedStart,
      end: roundedEnd
    });
  
    // Set slot and open modal
    setSelectedSlot({
      start: roundedStart,
      end: roundedEnd
    });
    setShowNewAppointmentDialog(true);
  };
  
  // Update the generateAvailableSlots function as well
 

  const calendarEvents = [
    ...(selectedTherapist.appointments?.map((apt) => ({
      id: apt.id,
      title: `${apt.clientName}`,
      start: new Date(apt.startTime),
      end: new Date(apt.endTime),
      status: apt.status,
      type: "appointment",
    })) || []),
    ...generateAvailableSlots(),
  ];
  return (
    <div className="p-6">
    <Card title="Appointments Management">
      <div className="mb-4">
        <Text className="block mb-2">
          Selected Therapist: {selectedTherapist.user.fullname}
        </Text>
        <Text className="block mb-4 text-gray-500">
          Click on any green "Available" slot to create an appointment
        </Text>
      </div>

      <Calendar
        localizer={localizer}
        events={[
          ...(selectedTherapist.appointments?.map((apt) => ({
            id: apt.id,
            title: `${apt.clientName}`,
            start: new Date(apt.startTime),
            end: new Date(apt.endTime),
            status: apt.status,
            type: "appointment",
          })) || []),
          ...generateAvailableSlots(),
        ]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        views={["week", "day"]}
        defaultView="week"
        min={new Date(2024, 0, 1, 8, 0)} // Start at 8 AM
        max={new Date(2024, 0, 1, 18, 0)} // End at 6 PM
        step={60}
        timeslots={1}
      />
    </Card>

    <AppointmentModal
      open={showNewAppointmentDialog}
      onCancel={() => setShowNewAppointmentDialog(false)}
      onSubmit={handleCreateAppointment}
      selectedSlot={selectedSlot}
      selectedClient={selectedClient}
      setSelectedClient={setSelectedClient}
      therapist={selectedTherapist}
      clients={MOCK_CLIENTS}
      loading={loading}
    />
  </div>
  );
};

export default AppointmentsPage;
