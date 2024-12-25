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
  Alert,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  TeamOutlined,
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
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";

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
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
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
        notes: appointmentData.notes, // Use notes from form data
      };

      await dispatch(addAppointment(newAppointment)).unwrap();
      message.success("Appointment created successfully");
      // Reset values
      setShowNewAppointmentDialog(false);
      setSelectedClient(null);
      setSelectedSlot(null);
    } catch (error) {
      message.error("Failed to create appointment");
    }
  };

  const generateAvailableSlots = () => {
    if (!selectedTherapist?.availableHours) return [];

    const slots = [];
    const today = new Date();
    // Set time to start of day to ensure proper comparison
    today.setHours(0, 0, 0, 0);

    // Set end date to last day of next month
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2, 0);

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    // Start from today instead of previous month
    for (
      let date = new Date(today);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayName = dayNames[date.getDay()];
      const availableHours = selectedTherapist.availableHours[dayName];

      // Skip if day is unavailable
      if (availableHours === "unavailable") continue;

      if (availableHours) {
        const [startTime, endTime] = availableHours.split("-");

        // Parse hours and minutes
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        // Create a single available block for the day
        const dayStart = new Date(date);
        dayStart.setHours(startHour, startMinute, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(endHour, endMinute, 0, 0);

        slots.push({
          title: `Available (${startTime} - ${endTime})`,
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
      setShowAppointmentDetails(true);
      setSelectedAppointment(event);
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
    const availableHours = selectedTherapist?.availableHours[dayName];

    // Check if therapist works on this day
    if (!availableHours || availableHours === "unavailable") {
      message.warning("Therapist is not available on this day");
      return;
    }

    // Parse available hours
    const [startTime, endTime] = availableHours.split("-");
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    // Create Date objects for the available time range
    const availableStart = new Date(selectedDate);
    availableStart.setHours(startHour, startMinute, 0, 0);

    const availableEnd = new Date(selectedDate);
    availableEnd.setHours(endHour, endMinute, 0, 0);

    // Check if selected time range is within available hours
    if (slotInfo.start < availableStart || slotInfo.end > availableEnd) {
      message.warning(
        `Available hours for ${dayName} are ${startTime} - ${endTime}`
      );
      return;
    }

    // Rest of the function remains the same
    // Check for conflicts with existing appointments...

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

    if (event.status === "CANCELED") {
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

  if (!selectedTherapist) {
    return (
      <div className="p-6">
        <Card
          hoverable
          className="max-w-lg mx-auto transform transition-all duration-300 hover:shadow-lg"
          style={{
            borderRadius: "16px",
            border: "none",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: "32px" }}
        >
          <div className="text-center">
            <div className="p-4 rounded-2xl bg-white shadow-sm inline-block mb-6">
              <TeamOutlined
                style={{
                  fontSize: "48px",
                  color: "#1890ff",
                }}
              />
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              No Therapist Selected
            </h2>
            <p className="text-gray-500 mb-8">
              To view and manage appointments, please select a therapist first
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/admin/therapists")}
              className="shadow-md h-12 px-8 text-base"
            >
              Go to Therapists Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
              notes: apt.notes,
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
            // Add this format for the date range header
            dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
              `${localizer.format(start, "MMMM dd, yyyy")} – ${localizer.format(
                end,
                "dd, yyyy"
              )}`,
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
      {selectedAppointment && (
        <AppointmentDetailsModal
          open={showAppointmentDetails}
          onClose={() => {
            setShowAppointmentDetails(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          therapist={selectedTherapist}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
