import React, { useState, useEffect } from "react";
import { Calendar, Button, Alert, Spin, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import { updateTherapistProfile } from "../../../features/auth/authSlice";
import { updateTherapist } from "../../../api/therapist";

function TherapistOfflineDateManager() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState([]); // Moment objects
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const therapistId = user?.user?.therapist?.id;
  const initialOfflineDates = user?.user?.therapist?.offlineDates || [];

  useEffect(() => {
    // Initialize selectedDates with the therapist's existing offline dates
    setSelectedDates(
      initialOfflineDates.map((date) => moment.utc(date))
    );
  }, [initialOfflineDates]);

  const isDateOffline = (date) => {
    if (!initialOfflineDates || !Array.isArray(initialOfflineDates)) {
      console.log("No offline dates available");
      return false;
    }

    // Log the current date being checked and all offline dates

    const isOffline = initialOfflineDates.some((offlineDate) => {
      const offlineDateMoment = moment(offlineDate);
      const offlineDateFormatted = offlineDateMoment.format("YYYY-MM-DD");
      const currentDateFormatted = date.format("YYYY-MM-DD");

      const isSame = offlineDateFormatted === currentDateFormatted;

      // Only log matches to reduce console noise
      if (isSame) {
        console.log(
          `✅ MATCH FOUND: Calendar date ${currentDateFormatted} matches offline date ${offlineDateFormatted}`
        );
      }
      return isSame;
    });

    return isOffline;
  };

  const handleDateSelect = (date) => {
    // Handle the selection of a date on the calendar
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );

    if (isSelected) {
      // If the date is already selected, remove it from selectedDates
      setSelectedDates(
        selectedDates.filter(
          (selectedDate) => !selectedDate.isSame(date, "day")
        )
      );
    } else {
      // If the date is not selected, add it to selectedDates
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert the selected dates to ISO string format
      const datesToSend = selectedDates.map((date) => date.toISOString());

      // Call the API to update the therapist's offline dates
      await updateTherapist(therapistId, { offlineDates: datesToSend });

      // Dispatch the Redux action to update the therapist's profile
      dispatch(
        updateTherapistProfile({
          therapistId: therapistId,
          updatedData: { offlineDates: datesToSend },
        })
      );

      message.success("Offline dates updated successfully!");
    } catch (err) {
      console.error("Error updating offline dates:", err);
      setError("Failed to update offline dates. Please try again.");
      message.error("Failed to update offline dates.");
    } finally {
      setLoading(false);
    }
  };

  const headerRender = ({ value, onChange }) => {
    // Render the header of the calendar with navigation buttons
    const prevMonth = () => {
      const newValue = value.clone().subtract(1, "month");
      onChange(newValue);
    };

    const nextMonth = () => {
      const newValue = value.clone().add(1, "month");
      onChange(newValue);
    };

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          background: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <Button icon={<LeftOutlined />} onClick={prevMonth} />
        <Typography.Title level={5} style={{ margin: 0 }}>
          {value.format("MMMM YYYY")}
        </Typography.Title>
        <Button icon={<RightOutlined />} onClick={nextMonth} />
      </div>
    );
  };

  const dateCellRender = (date) => {


    const isOffline = isDateOffline(date);
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );
    console.log(isOffline)

    let cellClass = "";
    if (isOffline) {
      cellClass += "offline-date";
    }
    if (isSelected) {
      cellClass += "selected-date";
    }

    return (
      <div className={cellClass}>
        {cellClass === "offline-date" ? <h1 className="closed-date-calender">Closed</h1> : null}
        {cellClass === "selected-date" ? "Selected" : null}
        {/* You can add content here if you want */}
      </div>
    );
  };

  return (
    <div className="offline-date-manager">
    

      {error && <Alert message={`Error: ${error}`} type="error" showIcon />}
      {loading && <Spin size="large" />}
      {selectedDates.length ? (
      <Button
        type="primary"
        onClick={handleSave}
        disabled={loading}
      >
        Save Changes
      </Button>): null}

      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleDateSelect}
        className="my-calendar"
        headerRender={headerRender}
        style={{ width: "100%" }}

      />
    </div>
  );
}

export default TherapistOfflineDateManager;