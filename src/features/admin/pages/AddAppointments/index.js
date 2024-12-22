import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Card,
  Select,
  Modal,
  Button,
  Typography,
  message,
  Tag,
  Avatar,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import AppointmentModal from "./components/AppointmentModal";
import {
  fetchAppointments,
  addAppointment,
  selectAppointments,
  selectSelectedTherapist,
  selectAppointmentStatus,
  selectAppointmentError,
} from "../../../../store/appointment/appointmentSlice";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;

// Mock default therapist

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedTherapist = useSelector(selectSelectedTherapist);
  const appointments = useSelector(selectAppointments);
  const status = useSelector(selectAppointmentStatus);
  const error = useSelector(selectAppointmentError);

  const [showNewAppointmentDialog, setShowNewAppointmentDialog] =
    useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const initializeAppointments = async () => {
      if (selectedTherapist && status === "idle") {
        try {
          await dispatch(
            fetchAppointments({
              therapistId: selectedTherapist.id,
            })
          ).unwrap();
        } catch (error) {
          message.error("Failed to load appointments");
        }
      }
    };

    initializeAppointments();
  }, [selectedTherapist, status, dispatch]);

  const handleCreateAppointment = async (appointmentData) => {
    if (!selectedClient || !appointmentData) return;

    try {
      const newAppointment = {
        clientId: selectedClient.id,
        therapistId: selectedTherapist.id,
        startTime: appointmentData.start.toISOString(),
        endTime: appointmentData.end.toISOString(),
        notes: "Initial appointment",
      };

      await dispatch(addAppointment(newAppointment)).unwrap();
      message.success("Appointment created successfully");
      setShowNewAppointmentDialog(false);
    } catch (error) {
      message.error("Failed to create appointment");
    }
  };

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
      setSelectedSlot({
        start: event.start,
        end: event.end,
      });
      setShowNewAppointmentDialog(true);
    } else if (event.type === "appointment") {
      Modal.info({
        title: null, // Remove default title
        icon: null, // Remove default icon
        className: "appointment-details-modal",
        content: (
          <div className="appointment-details-content">
            {/* Header Section */}
            <div className="appointment-header">
              <CalendarOutlined className="header-icon" />
              <h2>Appointment Details</h2>
            </div>

            {/* Status Badge */}
            <div className="status-section">
              <Tag
                color={event.status === "SCHEDULED" ? "processing" : "success"}
              >
                {event.status}
              </Tag>
            </div>

            {/* Main Content Card */}
            <Card className="appointment-card">
              {/* Date and Time Section */}
              <div className="info-section date-time">
                <CalendarOutlined className="section-icon" />
                <div>
                  <h4>Date & Time</h4>
                  <p>{format(event.start, "PPPP")}</p>
                  <p className="time">
                    <ClockCircleOutlined /> {format(event.start, "h:mm a")} -{" "}
                    {format(event.end, "h:mm a")}
                  </p>
                </div>
              </div>

              {/* Client Section */}
              <div className="info-section client">
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  className="client-avatar"
                />
                <div>
                  <h4>Client</h4>
                  <p>{event.title}</p>
                </div>
              </div>

              {/* Therapist Section */}
              <div className="info-section therapist">
                <Avatar
                  size={40}
                  src={selectedTherapist.profilePicture}
                  icon={!selectedTherapist.profilePicture && <UserOutlined />}
                  className="therapist-avatar"
                />
                <div>
                  <h4>Therapist</h4>
                  <p>{selectedTherapist.user.fullname}</p>
                  <Tag color="blue">
                    {selectedTherapist.specializations.type}
                  </Tag>
                </div>
              </div>
            </Card>
          </div>
        ),
        width: 480,
        centered: true,
        okText: "Close",
        okButtonProps: {
          className: "modal-ok-button",
        },
      });
    }
  };

  // Inside AppointmentsPage component

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
  const eventStyleGetter = (event) => {
    let className = "";
    let style = {
      borderRadius: "6px",
      padding: "4px 8px",
      fontSize: "0.9em",
      border: "none", // Removed borders for cleaner look
      fontWeight: "500",
    };

    if (event.type === "available") {
      className = "available-slot";
      style.backgroundColor = "#52c41a"; // Solid green
      style.color = "white";
      style.opacity = 0.9;
    } else if (event.type === "appointment") {
      className = "booked-slot";
      style.backgroundColor = "#1890ff"; // Solid blue
      style.color = "white";
      style.opacity = 0.9;
    }

    if (event.status === "CANCELLED") {
      style.backgroundColor = "#ff4d4f"; // Solid red
      style.color = "white";
      style.opacity = 0.9;
    }

    // Add hover effect through CSS
    style.cursor = "pointer";
    style.transition = "all 0.2s ease";

    return {
      style,
      className: `calendar-event ${className}`,
    };
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  return (
    <div className="p-6">
      <Card title="Appointments Management">
        <div className="mb-4">
          {selectedTherapist && (
            <>
              <Text className="block mb-2">
                Selected Therapist: {selectedTherapist.user.fullname}
              </Text>
              <Text className="block mb-4 text-gray-500">
                Click on any green "Available" slot to create an appointment
              </Text>
            </>
          )}
        </div>
        {status === "loading" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Spin indicator={antIcon} tip="Loading appointments..." />
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={[
            ...(appointments?.map((apt) => ({
              id: apt.id,
              title: apt.clientName || "Booked",
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
          components={{
            timeSlotWrapper: ({ children, value }) => (
              <div title={format(value, "h:mm a")} className="custom-time-slot">
                {children}
              </div>
            ),
            eventWrapper: ({ children, event }) => (
              <div
                title={`${event.title} (${format(
                  event.start,
                  "h:mm a"
                )} - ${format(event.end, "h:mm a")})`}
                className="custom-event-wrapper"
              >
                {children}
              </div>
            ),
          }}
          dayLayoutAlgorithm="no-overlap"
        />
      </Card>
      {selectedTherapist ? (
        <AppointmentModal
          open={showNewAppointmentDialog}
          onCancel={() => setShowNewAppointmentDialog(false)}
          onSubmit={handleCreateAppointment}
          selectedSlot={selectedSlot}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          therapist={selectedTherapist}
          loading={status === "loading"}
        />
      ) : null}
    </div>
  );
};

export default AppointmentsPage;
