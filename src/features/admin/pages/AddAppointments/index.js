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
import { fetchOfflineDates } from "../../../../store/admin/offlineDatesSlice"; // Import the action

import { useNavigate } from "react-router-dom";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import moment from "moment"; // Import Moment.js
import useResponsive from "../../../../hooks/useResponsive";

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
  const isMobile = useResponsive();

  const [showNewAppointmentDialog, setShowNewAppointmentDialog] =
    useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Offline dates from your slice
  const offlineDatesObject = useSelector((state) => state.offlineDates); // Replace with your actual selector path
  const offlineDates = offlineDatesObject?.offlineDates?.offlineDates || [];
  const offlineDatesStatus = useSelector((state) => state.offlineDates.status);
  const offlineDatesError = useSelector((state) => state.offlineDates.error);
  console.log("selectedTherapist", selectedTherapist);
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

  useEffect(() => {
    // Re-generate slots when either offline dates source changes
    if (selectedTherapist || offlineDates) {
      // This will trigger a re-render with updated available slots
      const slots = generateAvailableSlots();
      // You might want to store these in state if needed
    }
  }, [selectedTherapist?.offlineDates, offlineDates]);
  // Fetch offline dates when component mounts
  useEffect(() => {
    if (offlineDatesStatus === "idle") {
      dispatch(fetchOfflineDates());
    }
  }, [dispatch, offlineDatesStatus]);

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
    today.setHours(0, 0, 0, 0);

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

    for (
      let date = new Date(today);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayName = dayNames[date.getDay()];
      const availableHours = selectedTherapist.availableHours[dayName];

      // Skip if day is unavailable
      if (availableHours === "unavailable") continue;

      // Check both admin and therapist offline dates
      const formattedDate = moment(date).format("YYYY-MM-DD");
      if (isDateOffline(formattedDate)) {
        continue; // Skip this date if it's marked as offline by either admin or therapist
      }

      if (availableHours) {
        const [startTime, endTime] = availableHours.split("-");
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

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
      // Check if the selected date is an offline date
      const formattedDate = moment(event.start).format("YYYY-MM-DD");
      if (isDateOffline(formattedDate)) {
        message.warning("This date is unavailable.");
        return;
      }
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

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = new Date(slotInfo.start);
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

    // Check both admin and therapist offline dates
    if (isDateOffline(formattedDate)) {
      message.warning("This date is unavailable.");
      return;
    }

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

  // Function to check if a date is an offline date
  const isDateOffline = (date) => {
    // Check admin-set offline dates
    const isAdminOffline = offlineDates.some(
      (offlineDate) => moment(offlineDate).format("YYYY-MM-DD") === date
    );

    // Check therapist's personal offline dates
    const isTherapistOffline = selectedTherapist?.offlineDates?.some(
      (offlineDate) => moment(offlineDate).format("YYYY-MM-DD") === date
    );

    return isAdminOffline || isTherapistOffline;
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
      borderRadius: "0px",
      padding: "4px 8px",
      fontSize: "0", // Hide text by setting font size to 0
      border: "none", // Removed borders for cleaner look
      fontWeight: "500",
    };

    if (event.type === "available") {
      className = "available-slot";
      style.backgroundColor = "rgb(133 107 46)"; // Solid green
      style.color = "transparent";
      style.opacity = 0.9;
    } else if (event.type === "appointment") {
      className = "booked-slot";
      style.backgroundColor =
        selectedTherapist?.therapistType === "Shadow_Teacher"
          ? "#bc02a6" // Solid blue
          : selectedTherapist?.therapistType === "Psychologist"
          ? "#2196F3" // Solid blue
          : selectedTherapist?.therapistType === "Therapist"
          ? "#3e8e41" // Solid blue
          : (style.color = "transparent");
      style.opacity = 0.9;
    }

    if (event.status === "CANCELED") {
      style.backgroundColor = "#ff4d4f"; // Solid red
      style.color = "transparent";
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
            <div className="add-p-btnsc">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/admin/therapists")}
                className="shadow-md h-12 px-8 text-base therapist-btn"
              >
                Go to Therapists Page
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/admin/psychologist")}
                className="shadow-md h-12 px-8 text-base psychologist-btn"
              >
                Go to Psychologist Page
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/admin/shadow-teacher")}
                className="shadow-md h-12 px-8 text-base shadow-teacher-btn"
              >
                Go to Shadow Teacher Page
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  const calendarFormats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "h a", culture),

    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "h:mm a", culture)} - ${localizer.format(
        end,
        "h:mm a",
        culture
      )}`,

    selectRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "h:mm a", culture)} - ${localizer.format(
        end,
        "h:mm a",
        culture
      )}`,

    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "MMMM dd, yyyy")} – ${localizer.format(
        end,
        "dd, yyyy"
      )}`,

    // New custom format for day headers in mobile view
    dayFormat: (date, culture, localizer) => {
      if (isMobile) {
        // Mobile: Just show the date number without day name
        return localizer.format(date, "d", culture);
      } else {
        // Desktop: Show date and day name
        return `${localizer.format(date, "d")} ${localizer.format(
          date,
          "EEE",
          culture
        )}`;
      }
    },

    // New custom format for header cells
    dayHeaderFormat: (date, culture, localizer) => {
      if (isMobile) {
        // Mobile: Just the date number
        return localizer.format(date, "d", culture);
      } else {
        // Desktop: Show date and day name
        return `${localizer.format(date, "d")} ${localizer.format(
          date,
          "EEE",
          culture
        )}`;
      }
    },
  };
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
          formats={calendarFormats}
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
