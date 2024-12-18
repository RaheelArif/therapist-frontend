import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Select, Modal, Button, Typography, message } from "antd";

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
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    // Generate slots for next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);

      const dayName = dayNames[date.getDay()];

      if (selectedTherapist.availableHours[dayName]) {
        const [startHour, endHour] = selectedTherapist.availableHours[dayName]
          .split("-")
          .map(Number);

        const adjustedEndHour = endHour < startHour ? endHour + 12 : endHour;

        // Create a single available block for the day
        const dayStart = new Date(date);
        dayStart.setHours(startHour, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(adjustedEndHour, 0, 0, 0);

        slots.push({
          title: `Available (${startHour}:00 - ${endHour}:00)`,
          start: dayStart,
          end: dayEnd,
          type: "available",
        });
      }
    }
    return slots;
  };

  const handleSelectEvent = (event) => {
    if (event.type === "available") {
      // When clicking an available slot
      setSelectedSlot({
        start: event.start,
        end: event.end,
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

      // Use the actual start and end times from the drag selection
      const newAppointment = {
        id: Date.now().toString(),
        clientId: selectedClient.id,
        clientName: selectedClient.user.fullname,
        startTime: appointmentData.start.toISOString(),
        endTime: appointmentData.end.toISOString(), // Use the actual end time
        status: "SCHEDULED",
        createdAt: new Date().toISOString(),
      };

      // Check for booking conflicts
      const hasConflict = selectedTherapist.appointments?.some((apt) => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        return (
          (appointmentData.start >= aptStart &&
            appointmentData.start < aptEnd) ||
          (appointmentData.end > aptStart && appointmentData.end <= aptEnd)
        );
      });

      if (hasConflict) {
        message.error("This time slot conflicts with an existing appointment");
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
  const handleSelectSlot = (slotInfo) => {
    const selectedDate = new Date(slotInfo.start);
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[selectedDate.getDay()];

    // Check if therapist works on this day
    if (!selectedTherapist?.availableHours[dayName]) {
      message.warning("Therapist is not available on this day");
      return;
    }

    // Get available hours for that day
    const [startHour, endHour] = selectedTherapist.availableHours[dayName]
      .split("-")
      .map(Number);

    // Convert endHour if it's in 12-hour format
    const adjustedEndHour = endHour < startHour ? endHour + 12 : endHour;

    // Create Date objects for the available time range
    const availableStart = new Date(selectedDate);
    availableStart.setHours(startHour, 0, 0, 0);

    const availableEnd = new Date(selectedDate);
    availableEnd.setHours(adjustedEndHour, 0, 0, 0);

    // Check if selected time range is within available hours
    if (slotInfo.start < availableStart || slotInfo.end > availableEnd) {
      message.warning(
        `Available hours for ${dayName} are ${startHour}:00 AM - ${endHour}:00 PM`
      );
      return;
    }

    // Check for conflicts with existing appointments
    const hasConflict = selectedTherapist.appointments?.some((apt) => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      return (
        (slotInfo.start >= aptStart && slotInfo.start < aptEnd) ||
        (slotInfo.end > aptStart && slotInfo.end <= aptEnd)
      );
    });

    if (hasConflict) {
      message.warning("This time slot conflicts with an existing appointment");
      return;
    }

    setSelectedSlot(slotInfo);
    setShowNewAppointmentDialog(true);
  };

  const customComponents = {
    timeSlotWrapper: ({ children, value }) => (
      <div title={format(value, "h:mm a")} style={{ height: "100%" }}>
        {children}
      </div>
    ),
  };
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
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day"]}
          defaultView="week"
          min={new Date(2024, 0, 1, 8, 0)}
          max={new Date(2024, 0, 1, 18, 0)}
          step={15}
          timeslots={4}
          selectable={true}
          longPressThreshold={10}
          tooltipAccessor={(event) => {
            if (event.type === "available") {
              return `Click to schedule (${format(
                event.start,
                "h:mm a"
              )} - ${format(event.end, "h:mm a")})`;
            }
            return `${event.title}: ${format(event.start, "h:mm a")} - ${format(
              event.end,
              "h:mm a"
            )}`;
          }}
          components={customComponents}
          formats={{
            timeGutterFormat: (date, culture, localizer) =>
              localizer.format(date, "h:mm a", culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              `${localizer.format(
                start,
                "h:mm a",
                culture
              )} - ${localizer.format(end, "h:mm a", culture)}`,
            selectRangeFormat: ({ start, end }, culture, localizer) =>
              `${localizer.format(
                start,
                "h:mm a",
                culture
              )} - ${localizer.format(end, "h:mm a", culture)}`,
          }}
          dayPropGetter={(date) => ({
            style: {
              cursor: "pointer",
            },
          })}
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
