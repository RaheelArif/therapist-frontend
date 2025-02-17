import React, { useState, useEffect } from "react";
import { Calendar, Button, Alert, Spin, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateTherapist } from "../../../api/therapist";
import { updateTherapistProfile } from "../../../features/auth/authSlice";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";

function TherapistOfflineDateManager() {
  const { user } = useSelector((state) => state.auth);
  const therapistId = user?.user?.therapist?.id;
  const offlineDates = user?.user?.therapist?.offlineDates || [];

  const dispatch = useDispatch();
  const [selectedDates, setSelectedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDateOffline = (date) => {
    if (!offlineDates || !Array.isArray(offlineDates)) {
      return false;
    }

    return offlineDates.some((offlineDate) => {
      const offlineDateMoment = moment(offlineDate);
      const offlineDateFormatted = offlineDateMoment.format("YYYY-MM-DD");
      const currentDateFormatted = date.format("YYYY-MM-DD");
      return offlineDateFormatted === currentDateFormatted;
    });
  };

  const handleDateSelect = (date) => {
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );

    if (isSelected) {
      setSelectedDates(
        selectedDates.filter(
          (selectedDate) => !selectedDate.isSame(date, "day")
        )
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert current offline dates to Set for comparison
      const offlineDatesSet = new Set(
        offlineDates.map((date) => moment(date).format("YYYY-MM-DD"))
      );

      // Process selected dates
      const { toAdd, toRemove } = selectedDates.reduce(
        (acc, selectedDate) => {
          const formattedDate = selectedDate.format("YYYY-MM-DD");

          if (offlineDatesSet.has(formattedDate)) {
            acc.toRemove.push(formattedDate);
          } else {
            acc.toAdd.push(selectedDate.toISOString());
          }

          return acc;
        },
        { toAdd: [], toRemove: [] }
      );

      // Update offline dates
      const updatedOfflineDates = offlineDates.filter(
        (offlineDate) =>
          !toRemove.includes(moment(offlineDate).format("YYYY-MM-DD"))
      );

      const finalOfflineDates = [...updatedOfflineDates, ...toAdd];

      // Update through API
      await updateTherapist(therapistId, { offlineDates: finalOfflineDates });

      // Update Redux store
      dispatch(
        updateTherapistProfile({
          therapistId,
          updatedData: { offlineDates: finalOfflineDates },
        })
      );

      setSelectedDates([]);
    } catch (err) {
      setError(err.message || "Failed to update offline dates");
    } finally {
      setIsLoading(false);
    }
  };

  const headerRender = ({ value, onChange }) => {
    const prevMonth = () => {
      const newValue = value.clone().subtract(1, "month");
      onChange(newValue);
      setSelectedDates([]);
    };

    const nextMonth = () => {
      const newValue = value.clone().add(1, "month");
      onChange(newValue);
      setSelectedDates([]);
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

    let cellClass = "";
    if (isOffline) {
      cellClass += "offline-date";
    }
    if (isSelected) {
      cellClass += " selected-date";
    }

    return (
      <div className={cellClass}>
        {cellClass === "offline-date" ? (
          <h1 className="closed-date-calender">Closed</h1>
        ) : null}
        {cellClass === "selected-date" ? "Selected" : null}{" "}
      </div>
    );
  };

  const getClassName = (date) => {
    const isOffline = isDateOffline(date);
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(date, "day")
    );

    if (isOffline) return "offline-date";
    if (isSelected) return "selected-date";
    return "";
  };

  return (
    <div className="therapist-offline-date-manager">
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {selectedDates.length > 0 && (
        <Button
          type="primary"
          onClick={handleSave}
          disabled={isLoading}
          style={{ marginBottom: 16 }}
        >
          Save Changes
        </Button>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={handleDateSelect}
          className="my-calendar"
          headerRender={headerRender}
          style={{ width: "100%" }}
          cellClassName={getClassName}
        />
      )}
    </div>
  );
}

export default TherapistOfflineDateManager;
