import React from "react";
import { Modal, Tag } from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

const AppointmentDetailsModal = ({ open, onClose, appointment, therapist }) => {
  if (!appointment) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      className="appointment-modal"
    >
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 onClick={() => console.log(appointment, open)}>
            Appointment Details
          </h2>
        </div>

        {/* Date and Status */}
        <div className="appointment-date">
          {format(new Date(appointment.start), "EEEE, MMMM d, yyyy")}
          <Tag
            className="status-tag"
            color={appointment.status === "SCHEDULED" ? "blue" : "success"}
          >
            {appointment.status}
          </Tag>
        </div>

        {/* Time */}
        <div className="time-section">
          <ClockCircleOutlined />
          {format(new Date(appointment.start), "h:mm aaa")} -{" "}
          {format(new Date(appointment.end), "h:mm aaa")}
        </div>

        {/* Client and Therapist Section - Side by Side */}
        <div className="people-section">
          {/* Client Side */}
          <div className="person-info">
            <div className="person-header">
              <UserOutlined />
              <span>Client</span>
            </div>
            <div className="person-details">
              <div className="person-avatar">
                <UserOutlined />
              </div>
              <div className="person-name">{appointment.title}</div>
            </div>
          </div>

          {/* Therapist Side */}
          <div className="person-info">
            <div className="person-header">
              <UserOutlined />
              <span>Therapist</span>
            </div>
            <div className="person-details">
              <div className="person-avatar">
                <UserOutlined />
              </div>
              <div className="person-content">
                <div className="person-name">{therapist.user.fullname}</div>
                <Tag color="blue" className="specialization-tag">
                  {therapist.specializations.type}
                </Tag>
                <div className="focus-text">
                  Focus: {therapist.specializations.focus}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {appointment.notes && (
          <div className="notes-section">
            <div className="section-title">
              <FileTextOutlined />
              Notes
            </div>
            <div className="notes-content">{appointment.notes}</div>
          </div>
        )}

        {/* Additional Details */}
        <div className="additional-details">
          <div className="section-title">
            <EnvironmentOutlined />
            Additional Details
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <EnvironmentOutlined />
              <div>
                <div className="detail-label">Location</div>
                <div className="detail-value">{therapist.workAddress}</div>
              </div>
            </div>
            <div className="detail-item">
              <ExperimentOutlined />
              <div>
                <div className="detail-label">Experience</div>
                <div className="detail-value">{therapist.experience} years</div>
              </div>
            </div>
            <div className="detail-item">
              <ClockCircleOutlined />
              <div>
                <div className="detail-label">Working Hours</div>
                <div className="detail-value">
                  {therapist.availableHours[
                    format(new Date(appointment.start), "EEEE").toLowerCase()
                  ] === "unavailable"
                    ? "Unavailable"
                    : therapist.availableHours[
                        format(
                          new Date(appointment.start),
                          "EEEE"
                        ).toLowerCase()
                      ]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;
