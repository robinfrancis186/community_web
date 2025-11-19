# Sample Data Summary

## Campuses (6 total)

1. **GEC Barton Hill** - Thiruvananthapuram (Impact Score: 98)
2. **CET Trivandrum** - Thiruvananthapuram (Impact Score: 95)
3. **Model Engineering College** - Kochi (Impact Score: 92)
4. **LBS Institute of Technology** - Thiruvananthapuram (Impact Score: 88)
5. **GEC Thrissur** - Thrissur (Impact Score: 85)
6. **NIT Calicut** - Kozhikode (Impact Score: 90)

## Courses (9 total)

### Existing Courses (3)
1. Inclusive Design Fundamentals (Design)
2. Assistive Technology 101 (Technology)
3. Advanced Web Accessibility (Development)

### New Courses Added (6)
4. **Disability Sensitization** (Awareness, Beginner, 4 hours)
   - Learn about different types of disabilities and how to create inclusive environments.

5. **Inclusive Design Workshop** (Design, Intermediate, 8 hours)
   - Master the principles of inclusive design and accessibility in digital products.

6. **Assistive Tech 101** (Technology, Beginner, 6 hours)
   - Introduction to assistive technologies and their applications.

7. **Accessibility in Web Development** (Development, Intermediate, 12 hours)
   - Build accessible web applications following WCAG guidelines.

8. **Universal Design Principles** (Design, Advanced, 10 hours)
   - Explore universal design principles for physical and digital spaces.

9. **Sign Language Basics** (Communication, Beginner, 5 hours)
   - Learn basic sign language for effective communication.

## Events (6 total)

1. **Community Meetup - December**
   - Type: Meetup
   - Date: 5 days from now
   - Location: Online - Zoom
   - Points: 100 | XP: 25
   - Max Participants: 200
   - Status: Upcoming

2. **Inclusive Design Challenge**
   - Type: Designathon
   - Date: 7-9 days from now
   - Location: GEC Barton Hill Auditorium
   - Points: 500 | XP: 100
   - Max Participants: 100
   - Status: Upcoming

3. **Disability Sensitization Training**
   - Type: Workshop
   - Date: 10 days from now
   - Location: LBS Institute
   - Points: 400 | XP: 100
   - Max Participants: 60
   - Status: Upcoming

4. **Accessibility Workshop**
   - Type: Workshop
   - Date: 14 days from now
   - Location: CET Trivandrum - Lab 3
   - Points: 300 | XP: 75
   - Max Participants: 50
   - Status: Upcoming

5. **Assistive Tech Hackathon**
   - Type: Hackathon
   - Date: 21-22 days from now
   - Location: Model Engineering College
   - Points: 600 | XP: 150
   - Max Participants: 80
   - Status: Upcoming

6. **Innovation Showcase**
   - Type: Meetup
   - Date: 30 days from now
   - Location: GEC Thrissur
   - Points: 350 | XP: 80
   - Max Participants: 150
   - Status: Upcoming

## Badges (7 total)

1. **Early Adopter** - One of the first members to join (50 XP)
2. **Design Champion** - Completed design challenges (100 XP)
3. **Top Contributor** - Active community contributor (150 XP)
4. **Problem Solver** - Solved community challenges (100 XP)
5. **Course Master** - Completed multiple courses (200 XP)
6. **Event Enthusiast** - Attended multiple events (150 XP)
7. **Innovation Leader** - Created innovative projects (250 XP)

## Channels (4 total)

1. **general** - General community discussions
2. **announcements** - Official announcements
3. **design-help** - Get help with design challenges
4. **random** - Random conversations

## Database Statistics

Run this query to see current counts:

```sql
SELECT 
    (SELECT COUNT(*) FROM campuses) as campuses,
    (SELECT COUNT(*) FROM courses) as courses,
    (SELECT COUNT(*) FROM events) as events,
    (SELECT COUNT(*) FROM badges) as badges,
    (SELECT COUNT(*) FROM channels) as channels,
    (SELECT COUNT(*) FROM profiles) as profiles,
    (SELECT COUNT(*) FROM user_courses) as enrollments,
    (SELECT COUNT(*) FROM event_registrations) as registrations;
```

## Viewing Sample Data

### View All Events
```sql
SELECT 
    title,
    event_type,
    status,
    start_date,
    location,
    points,
    xp_reward,
    c.name as campus_name
FROM events e
LEFT JOIN campuses c ON e.campus_id = c.id
ORDER BY start_date;
```

### View All Courses
```sql
SELECT 
    title,
    category,
    difficulty,
    duration_hours,
    created_at
FROM courses
ORDER BY created_at DESC;
```

### View All Campuses
```sql
SELECT 
    name,
    location,
    impact_score,
    created_at
FROM campuses
ORDER BY impact_score DESC;
```

