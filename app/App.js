
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ImprovedCalendarAssistant() {
  // Current date settings
  const today = new Date("2025-03-08");
  const [viewDate, setViewDate] = useState(today);
  
  // View states
  const [activeView, setActiveView] = useState("chat"); // "chat" or "calendar"
  const [calendarView, setCalendarView] = useState("week");
  
  // Chat states
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: "Hi there! I'm your scheduling assistant. How can I help organize your week?", 
      isUser: false, 
      timestamp: new Date(Date.now() - 60000 * 10)
    },
    { 
      id: '2', 
      text: "I need to schedule time to work on my project proposal.", 
      isUser: true, 
      timestamp: new Date(Date.now() - 60000 * 9)
    },
    { 
      id: '3', 
      text: "I'd be happy to help! When is your project due and how much time do you need?", 
      isUser: false, 
      timestamp: new Date(Date.now() - 60000 * 8)
    },
    { 
      id: '4', 
      text: "It's due on Friday, and I'll need about 4 hours total.", 
      isUser: true, 
      timestamp: new Date(Date.now() - 60000 * 7) 
    },
    { 
      id: '5', 
      text: "I've looked at your schedule, and I see you have some free time on Tuesday afternoon and Thursday morning. Would you like me to schedule two 2-hour blocks then?", 
      isUser: false, 
      timestamp: new Date(Date.now() - 60000 * 6),
      showCalendarPreview: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesRef = useRef(null);
  
  // Calendar events (same as in the web version)
  const [events, setEvents] = useState([
    // Academic Classes (beige/tan)
    {
      id: '1',
      title: "MATH 152",
      start: new Date("2025-03-03T10:30:00"),
      end: new Date("2025-03-03T12:20:00"),
      location: "Burnaby Campus",
      room: "AQ 3149",
      color: "#d4a76a",
      type: "academic",
      course: "MATH 152"
    },
    // ...other events from the previous code
    {
      id: '12',
      title: "Mountain Madness 2025",
      start: new Date("2025-03-08T09:00:00"),
      end: new Date("2025-03-08T22:30:00"),
      location: "Simon Fraser University",
      room: "",
      color: "#a142f4",
      type: "event",
      isAllDay: true
    }
  ]);
  
  // Pending changes to be approved
  const [pendingChanges, setPendingChanges] = useState({
    id: "change-1",
    title: "Project Proposal Scheduling",
    description: "Schedule two 2-hour blocks to work on your project proposal before Friday's deadline.",
    createdAt: new Date(),
    events: [
      {
        id: "pending-1",
        title: "Project Proposal",
        start: new Date("2025-03-04T13:00:00"),
        end: new Date("2025-03-04T15:00:00"),
        location: "Study Space",
        room: "",
        color: "#0b8043",
        type: "task"
      },
      {
        id: "pending-2",
        title: "Project Proposal",
        start: new Date("2025-03-06T11:00:00"),
        end: new Date("2025-03-06T13:00:00"),
        location: "Study Space",
        room: "",
        color: "#0b8043",
        type: "task"
      }
    ]
  });
  
  // Generate days for the week view
  const generateWeekDays = () => {
    const days = [];
    // Find the Monday of the current week
    const monday = new Date(viewDate);
    monday.setDate(viewDate.getDate() - viewDate.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    
    return days;
  };
  
  const weekDays = generateWeekDays();
  
  // Hours for the day view (8 AM to 9 PM)
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollToEnd();
    }
  }, [messages]);
  
  // Handle accepting changes
  const handleAcceptChanges = () => {
    // Add the pending events to the calendar
    setEvents([...events, ...pendingChanges.events]);
    
    // Add a confirmation message
    const confirmationMessage = {
      id: String(messages.length + 1),
      text: "I've added your Project Proposal work blocks to your calendar: Tuesday from 1-3 PM and Thursday from 11 AM-1 PM. You can see them in your calendar now.",
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages([...messages, confirmationMessage]);
    
    // Reset UI states
    setPendingChanges(null);
    setActiveView("chat");
  };
  
  // Handle rejecting changes
  const handleRejectChanges = () => {
    // Add a message asking for better times
    const rejectionMessage = {
      id: String(messages.length + 1),
      text: "I'd prefer different times. Can you suggest some alternatives?",
      isUser: true,
      timestamp: new Date()
    };
    
    const assistantResponse = {
      id: String(messages.length + 2),
      text: "Of course! Let me look at your schedule again. How about Wednesday from 1-3 PM and Friday from 9-11 AM instead?",
      isUser: false,
      timestamp: new Date(Date.now() + 1000),
      showCalendarPreview: true
    };
    
    setMessages([...messages, rejectionMessage, assistantResponse]);
    
    // Update pending changes
    setPendingChanges({
      ...pendingChanges,
      id: "change-2",
      events: [
        {
          id: "pending-3",
          title: "Project Proposal",
          start: new Date("2025-03-05T13:00:00"),
          end: new Date("2025-03-05T15:00:00"),
          location: "Study Space",
          room: "",
          color: "#0b8043",
          type: "task"
        },
        {
          id: "pending-4",
          title: "Project Proposal",
          start: new Date("2025-03-07T09:00:00"),
          end: new Date("2025-03-07T11:00:00"),
          location: "Study Space",
          room: "",
          color: "#0b8043",
          type: "task"
        }
      ]
    });
    
    // Reset UI state
    setActiveView("chat");
  };
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: String(messages.length + 1),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    
    // Simulate AI response based on message content
    setTimeout(() => {
      let responseText = "";
      let showCalendarPreview = false;
      
      // Simple intent detection
      const lowerCaseMsg = newMessage.toLowerCase();
      
      if (lowerCaseMsg.includes("accept") || lowerCaseMsg.includes("looks good")) {
        handleAcceptChanges();
        return;
      } else if (lowerCaseMsg.includes("reject") || lowerCaseMsg.includes("different time")) {
        handleRejectChanges();
        return;
      } else if (lowerCaseMsg.includes("show calendar") || lowerCaseMsg.includes("see calendar") || 
                lowerCaseMsg.includes("full calendar")) {
        responseText = "Here's your calendar for this week. You can see the suggested time blocks highlighted with dashed borders. Would you like to accept these times?";
        showCalendarPreview = true;
        setActiveView("calendar");
      } else if (lowerCaseMsg.includes("schedule") || lowerCaseMsg.includes("time")) {
        responseText = "Would you like me to help you schedule something? Please let me know what you need to schedule and when.";
      } else {
        responseText = "I'm here to help with your calendar. Let me know if you'd like to schedule something or if you have questions about your existing events.";
      }
      
      const aiResponse = {
        id: String(messages.length + 2),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        showCalendarPreview
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // If stopping recording, simulate transcription
    if (isRecording) {
      setTimeout(() => {
        const userMessage = {
          id: String(messages.length + 1),
          text: "Show me the full calendar",
          isUser: true,
          timestamp: new Date()
        };
        
        setMessages([...messages, userMessage]);
        
        // Simulate AI response
        setTimeout(() => {
          const aiResponse = {
            id: String(messages.length + 2),
            text: "Here's your full calendar with the suggested time blocks. You can see the pending changes highlighted with dashed borders. Would you like to accept these changes?",
            isUser: false,
            timestamp: new Date(),
            showCalendarPreview: true
          };
          
          setMessages(prev => [...prev, aiResponse]);
          setActiveView("calendar");
        }, 1000);
      }, 1000);
    }
  };
  
  // Format helpers
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const isToday = (date) => {
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Get events for a specific day
  const getEventsForDay = (date) => {
    const dateString = date.toDateString();
    
    // Regular events
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start).toDateString();
      return eventDate === dateString;
    });
    
    // Add pending events if they exist
    if (pendingChanges) {
      const pendingDayEvents = pendingChanges.events.filter(event => {
        const eventDate = new Date(event.start).toDateString();
        return eventDate === dateString;
      });
      
      return [...dayEvents, ...pendingDayEvents];
    }
    
    return dayEvents;
  };
  
  // Get all-day events for a specific day
  const getAllDayEventsForDay = (date) => {
    const dateString = date.toDateString();
    return events.filter(event => {
      const eventDate = new Date(event.start).toDateString();
      return eventDate === dateString && event.isAllDay;
    });
  };
  
  // Calculate event position for the calendar display
  const calculateEventPosition = (event) => {
    const startHour = event.start.getHours() + (event.start.getMinutes() / 60);
    const endHour = event.end.getHours() + (event.end.getMinutes() / 60);
    
    // Calculate position from top (based on start time)
    const firstDisplayedHour = 8; // Calendar starts at 8 AM
    const hourHeight = 60; // Height of one hour in the calendar
    const top = (startHour - firstDisplayedHour) * hourHeight;
    
    // Calculate height (based on duration)
    const height = (endHour - startHour) * hourHeight;
    
    // For pending events, add a dashed border
    const isPending = pendingChanges && pendingChanges.events.some(e => e.id === event.id);
    
    return {
      top,
      height,
      backgroundColor: event.color,
      borderWidth: isPending ? 2 : 0,
      borderStyle: isPending ? 'dashed' : 'solid',
      borderColor: '#000',
    };
  };
  
  // Render message item
  const renderMessageItem = ({ item }) => (
    <View style={styles.messageWrapper}>
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userMessageBubble : styles.assistantMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            item.isUser ? styles.userMessageTime : styles.assistantMessageTime
          ]}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
      
      {/* Calendar Preview in Chat */}
      {item.showCalendarPreview && !item.isUser && pendingChanges && (
        <View style={styles.previewContainer}>
          <WeekPreview 
            weekDays={weekDays}
            pendingChanges={pendingChanges}
            today={today}
            handleViewCalendar={() => setActiveView("calendar")}
            handleAcceptChanges={handleAcceptChanges}
            handleRejectChanges={handleRejectChanges}
            formatDate={formatDate}
            formatTime={formatTime}
            isToday={isToday}
          />
        </View>
      )}
    </View>
  );
  
  // Week Preview Component
  const WeekPreview = ({ 
    weekDays, 
    pendingChanges, 
    today, 
    handleViewCalendar, 
    handleAcceptChanges, 
    handleRejectChanges, 
    formatDate, 
    formatTime, 
    isToday 
  }) => (
    <View style={styles.weekPreviewCard}>
      <View style={styles.weekPreviewHeader}>
        <Text style={styles.weekPreviewTitle}>Weekly Schedule Preview</Text>
        <TouchableOpacity onPress={handleViewCalendar}>
          <Text style={styles.viewFullCalendarText}>View Full Calendar</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.weekDaysContainer}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDayColumn}>
              <View style={[
                styles.weekDayHeader,
                isToday(day) && styles.todayHeader
              ]}>
                <Text style={[
                  styles.weekDayText,
                  isToday(day) && styles.todayText
                ]}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <View style={[
                  styles.weekDayNumber,
                  isToday(day) && styles.todayNumber
                ]}>
                  <Text style={[
                    styles.weekDayNumberText,
                    isToday(day) && styles.todayNumberText
                  ]}>
                    {day.getDate()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.weekDayEvents}>
                {pendingChanges.events
                  .filter(event => new Date(event.start).toDateString() === day.toDateString())
                  .map((event, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.weekDayEvent,
                        {
                          backgroundColor: event.color,
                          borderWidth: 2,
                          borderColor: '#000',
                          borderStyle: 'dashed'
                        }
                      ]}
                    >
                      <Text style={styles.weekDayEventTitle} numberOfLines={1}>{event.title}</Text>
                      <Text style={styles.weekDayEventTime}>{formatTime(event.start).replace(/\s/g, '')}</Text>
                    </View>
                  ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {pendingChanges && (
        <View style={styles.pendingEventsContainer}>
          <Text style={styles.pendingEventsTitle}>Suggested Time Blocks:</Text>
          {pendingChanges.events.map((event, i) => (
            <View key={i} style={styles.pendingEventItem}>
              <View style={styles.pendingEventDot} />
              <Text style={styles.pendingEventText}>
                <Text style={styles.pendingEventName}>{event.title}</Text>: {formatDate(event.start)} • {formatTime(event.start)} - {formatTime(event.end)}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.previewActionsContainer}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={handleAcceptChanges}
        >
          <Text style={styles.acceptButtonText}>Accept Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.rejectButton}
          onPress={handleRejectChanges}
        >
          <Text style={styles.rejectButtonText}>Suggest Different Times</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Day column width for calendar
  const dayColumnWidth = 120; // Fixed width for day columns
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {activeView === "calendar" && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setActiveView("chat")}
            >
              <Ionicons name="chevron-back" size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {activeView === "calendar" ? "Calendar" : "Calendar Assistant"}
          </Text>
        </View>
        
        {activeView === "chat" && (
          <TouchableOpacity 
            style={styles.calendarButton}
            onPress={() => setActiveView("calendar")}
          >
            <Ionicons name="calendar" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Chat View */}
      {activeView === "chat" && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex1}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <FlatList
            ref={messagesRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            style={styles.flex1}
            onContentSizeChange={() => messagesRef.current.scrollToEnd({ animated: true })}
          />
          
          {/* Chat Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TouchableOpacity 
                style={[styles.micButton, isRecording && styles.micButtonActive]}
                onPress={toggleRecording}
              >
                <Ionicons 
                  name={isRecording ? "stop" : "mic"} 
                  size={20} 
                  color={isRecording ? "#FFFFFF" : "#6B7280"} 
                />
              </TouchableOpacity>
              
              <TextInput
                style={styles.textInput}
                placeholder={isRecording ? "Listening..." : "Message your assistant..."}
                placeholderTextColor="#9CA3AF"
                value={newMessage}
                onChangeText={setNewMessage}
                editable={!isRecording}
              />
              
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={newMessage.trim() ? "#3B82F6" : "#D1D5DB"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
      
      {/* Calendar View */}
      {activeView === "calendar" && (
        <View style={styles.flex1}>
          {/* GitHub-Style PR Banner */}
          {pendingChanges && (
            <View style={styles.prBanner}>
              <View style={styles.prBannerHeader}>
                <View style={styles.prIconContainer}>
                  <Ionicons name="git-pull-request" size={20} color="#3B82F6" />
                </View>
                <View style={styles.prTitleContainer}>
                  <Text style={styles.prTitle}>{pendingChanges.title}</Text>
                  <Text style={styles.prDescription}>{pendingChanges.description}</Text>
                </View>
              </View>
              
              <View style={styles.prEventsList}>
                <Text style={styles.prEventsTitle}>Proposed schedule changes:</Text>
                {pendingChanges.events.map((event, index) => (
                  <View key={index} style={styles.prEventItem}>
                    <View style={styles.prEventBullet} />
                    <Text style={styles.prEventText}>
                      <Text style={styles.prEventName}>{event.title}</Text>: {formatDate(event.start)} • {formatTime(event.start)} - {formatTime(event.end)}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.prActions}>
                <TouchableOpacity 
                  style={styles.acceptPrButton}
                  onPress={handleAcceptChanges}
                >
                  <Text style={styles.acceptPrButtonText}>Accept Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.rejectPrButton}
                  onPress={handleRejectChanges}
                >
                  <Text style={styles.rejectPrButtonText}>Suggest Different Times</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Calendar Controls */}
          <View style={styles.calendarControls}>
            <View style={styles.calendarControlsLeft}>
              <TouchableOpacity style={styles.todayButton}>
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
              <View style={styles.navButtons}>
                <TouchableOpacity style={styles.navButton}>
                  <Ionicons name="chevron-back" size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.currentMonth}>
                {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
            </View>
            
            <View style={styles.viewSelector}>
              <TouchableOpacity 
                style={[styles.viewOption, calendarView === 'day' && styles.activeViewOption]}
                onPress={() => setCalendarView('day')}
              >
                <Text style={[styles.viewOptionText, calendarView === 'day' && styles.activeViewOptionText]}>
                  Day
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewOption, calendarView === 'week' && styles.activeViewOption]}
                onPress={() => setCalendarView('week')}
              >
                <Text style={[styles.viewOptionText, calendarView === 'week' && styles.activeViewOptionText]}>
                  Week
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Day Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
            {weekDays.map((day, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.daySelectorItem, isToday(day) && styles.todaySelectorItem]}
              >
                <Text style={[styles.daySelectorDay, isToday(day) && styles.todaySelectorDay]}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <View style={[styles.daySelectorNumber, isToday(day) && styles.todaySelectorNumber]}>
                  <Text style={[styles.daySelectorNumberText, isToday(day) && styles.todaySelectorNumberText]}>
                    {day.getDate()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Calendar Grid */}
          <View style={styles.calendarContainer}>
            <ScrollView>
              <View style={styles.calendarContent}>
                {/* Time Labels */}
                <View style={styles.timeLabelsColumn}>
                  {/* Empty space for all-day events alignment */}
                  <View style={styles.allDayLabelSpace} />
                  
                  {/* Time labels */}
                  {hours.map((hour) => (
                    <View key={hour} style={styles.timeLabel}>
                      <Text style={styles.timeLabelText}>
                        {hour === 12 ? '12p' : hour < 12 ? `${hour}a` : `${hour-12}p`}
                      </Text>
                    </View>
                  ))}
                </View>
                
                {/* Events Grid */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.daysContainer}>
                    {weekDays.map((day, dayIndex) => (
                      <View key={dayIndex} style={[styles.dayColumn, { width: dayColumnWidth }]}>
                        {/* All-day events */}
                        <View style={styles.allDayEventsContainer}>
                          {getAllDayEventsForDay(day).map((event, eventIndex) => (
                            <View 
                              key={eventIndex}
                              style={[styles.allDayEvent, { backgroundColor: event.color }]}
                            >
                              <Text style={styles.allDayEventText} numberOfLines={1}>
                                {event.title}
                              </Text>
                            </View>
                          ))}
                        </View>
                        
                        {/* Time grid */}
                        <View style={styles.dayTimeGrid}>
                          {/* Hour slots */}
                          {hours.map((hour) => (
                            <View key={hour} style={styles.hourSlot} />
                          ))}
                          
                          {/* Events */}
                          {getEventsForDay(day)
                            .filter(event => !event.isAllDay)
                            .map((event, eventIndex) => {
                              const position = calculateEventPosition(event);
                              const isPending = pendingChanges && 
                                pendingChanges.events.some(e => e.id === event.id);
                              
                              return (
                                <View 
                                  key={`${event.id}-${eventIndex}`}
                                  style={[
                                    styles.calendarEvent,
                                    {
                                      top: position.top,
                                      height: position.height,
                                      backgroundColor: position.backgroundColor,
                                      borderWidth: position.borderWidth,
                                      borderStyle: position.borderStyle,
                                      borderColor: position.borderColor
                                    }
                                  ]}
                                >
                                  <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                                  <Text style={styles.eventTime}>{formatTime(event.start)} - {formatTime(event.end)}</Text>
                                  {event.location && (
                                    <Text style={styles.eventLocation} numberOfLines={1}>{event.location}</Text>
                                  )}
                                  {event.room && (
                                    <Text style={styles.eventRoom} numberOfLines={1}>{event.room}</Text>
                                  )}
                                  
                                  {isPending && (
                                    <View style={styles.newEventBadge}>
                                      <Text style={styles.newEventBadgeText}>new</Text>
                                    </View>
                                  )}
                                </View>
                              );
                            })}
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  calendarButton: {
    padding: 4,
  },
  
  // Messages styles
  messagesList: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageContainer: {
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  userMessageBubble: {
    backgroundColor: '#3B82F6',
  },
  assistantMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  assistantMessageTime: {
    color: '#6B7280',
  },
  
  // Chat input styles
  inputContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  micButton: {
    padding: 8,
    borderRadius: 20,
  },
  micButtonActive: {
    backgroundColor: '#EF4444',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingHorizontal: 8,
  },
  sendButton: {
    padding: 8,
  },
  
  // Week preview styles
  previewContainer: {
    marginTop: 8,
    marginLeft: 16,
    maxWidth: '90%',
  },
  weekPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  weekPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  weekPreviewTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  viewFullCalendarText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  weekDayColumn: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  weekDayHeader: {
    alignItems: 'center',
    padding: 4,
  },
  todayHeader: {
    backgroundColor: '#EFF6FF',
  },
  weekDayText: {
    fontSize: 12,
    color: '#6B7280',
  },
  todayText: {
    color: '#3B82F6',
  },
  weekDayNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  todayNumber: {
    backgroundColor: '#3B82F6',
  },
  weekDayNumberText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  todayNumberText: {
    color: '#FFFFFF',
  },
  weekDayEvents: {
    padding: 4,
  },
  weekDayEvent: {
    borderRadius: 4,
    padding: 4,
    marginBottom: 4,
  },
  weekDayEventTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  weekDayEventTime: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pendingEventsContainer: {
    padding: 12,
    backgroundColor: '#EFF6FF',
  },
  pendingEventsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 8,
  },
  pendingEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pendingEventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  pendingEventText: {
    fontSize: 12,
    color: '#1F2937',
  },
  pendingEventName: {
    fontWeight: '500',
  },
  previewActionsContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    marginRight: 4,
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    marginLeft: 4,
  },
  rejectButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  
  // GitHub-style PR banner
  prBanner: {
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
    padding: 16,
  },
  prBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  prTitleContainer: {
    flex: 1,
  },
  prTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  prDescription: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 2,
  },
  prEventsList: {
    marginTop: 12,
    paddingLeft: 48,
  },
  prEventsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 8,
  },
  prEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  prEventBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  prEventText: {
    fontSize: 14,
    color: '#1F2937',
  },
  prEventName: {
    fontWeight: '500',
  },
  prActions: {
    flexDirection: 'row',
    marginTop: 16,
    paddingLeft: 48,
  },
  acceptPrButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  acceptPrButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  rejectPrButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rejectPrButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Calendar controls
  calendarControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarControlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  todayButtonText: {
    fontSize: 12,
    color: '#111827',
  },
  navButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  navButton: {
    padding: 6,
  },
  currentMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  viewSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  viewOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeViewOption: {
    backgroundColor: '#EFF6FF',
  },
  viewOptionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeViewOptionText: {
    color: '#3B82F6',
  },
  
  // Day selector
  daySelector: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  daySelectorItem: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  todaySelectorItem: {
    backgroundColor: '#F0F9FF',
  },
  daySelectorDay: {
    fontSize: 12,
    color: '#6B7280',
  },
  todaySelectorDay: {
    color: '#3B82F6',
  },
  daySelectorNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  todaySelectorNumber: {
    backgroundColor: '#3B82F6',
  },
  daySelectorNumberText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  todaySelectorNumberText: {
    color: '#FFFFFF',
  },
  
  // Calendar grid
  calendarContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  calendarContent: {
    flexDirection: 'row',
  },
  timeLabelsColumn: {
    width: 50,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  allDayLabelSpace: {
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timeLabel: {
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timeLabelText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: -8,
  },
  daysContainer: {
    flexDirection: 'row',
  },
  dayColumn: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  allDayEventsContainer: {
    flexDirection: 'row',
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  allDayEvent: {
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 4,
  },
  allDayEventText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dayTimeGrid: {
    position: 'relative',
  },
  hourSlot: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarEvent: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 4,
    padding: 4,
  },
  eventTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  eventTime: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  eventLocation: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  eventRoom: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  newEventBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  newEventBadgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
  }
});

