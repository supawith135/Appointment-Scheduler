--
-- PostgreSQL database dump
--

-- Dumped from database version 15.7
-- Dumped by pg_dump version 15.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    reason text,
    status_id bigint,
    time_slot_id bigint,
    comment text,
    user_id bigint
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookings_id_seq OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: genders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genders (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    gender_name text NOT NULL
);


ALTER TABLE public.genders OWNER TO postgres;

--
-- Name: genders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genders_id_seq OWNER TO postgres;

--
-- Name: genders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genders_id_seq OWNED BY public.genders.id;


--
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    position_name text NOT NULL
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- Name: positions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.positions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.positions_id_seq OWNER TO postgres;

--
-- Name: positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.positions_id_seq OWNED BY public.positions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    role_name text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statuses (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    status text NOT NULL
);


ALTER TABLE public.statuses OWNER TO postgres;

--
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statuses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statuses_id_seq OWNER TO postgres;

--
-- Name: statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statuses_id_seq OWNED BY public.statuses.id;


--
-- Name: time_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.time_slots (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    user_id bigint,
    slot_date timestamp with time zone NOT NULL,
    slot_start_time timestamp with time zone NOT NULL,
    slot_end_time timestamp with time zone NOT NULL,
    location text,
    title text,
    is_available boolean
);


ALTER TABLE public.time_slots OWNER TO postgres;

--
-- Name: time_slots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.time_slots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.time_slots_id_seq OWNER TO postgres;

--
-- Name: time_slots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.time_slots_id_seq OWNED BY public.time_slots.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    position_id bigint,
    full_name text NOT NULL,
    role_id bigint,
    advisor_id bigint,
    email text NOT NULL,
    image text,
    facebook text,
    line text,
    contact_number text,
    location text,
    user_name text NOT NULL,
    password text,
    gender_id bigint
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: genders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genders ALTER COLUMN id SET DEFAULT nextval('public.genders_id_seq'::regclass);


--
-- Name: positions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions ALTER COLUMN id SET DEFAULT nextval('public.positions_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses ALTER COLUMN id SET DEFAULT nextval('public.statuses_id_seq'::regclass);


--
-- Name: time_slots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots ALTER COLUMN id SET DEFAULT nextval('public.time_slots_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, created_at, updated_at, deleted_at, reason, status_id, time_slot_id, comment, user_id) FROM stdin;
1	2024-09-24 21:15:42.466786+07	2024-09-24 21:15:58.16471+07	\N	fu8iy[asd	2	2	sdsdsd	5
\.


--
-- Data for Name: genders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genders (id, created_at, updated_at, deleted_at, gender_name) FROM stdin;
1	2024-09-24 21:14:34.179174+07	2024-09-24 21:14:34.179174+07	\N	ชาย
2	2024-09-24 21:14:34.180985+07	2024-09-24 21:14:34.180985+07	\N	หญิง
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.positions (id, created_at, updated_at, deleted_at, position_name) FROM stdin;
1	2024-09-24 21:14:34.183848+07	2024-09-24 21:14:34.183848+07	\N	ศาสตราจารย์
2	2024-09-24 21:14:34.185416+07	2024-09-24 21:14:34.185416+07	\N	รองศาสตราจารย์
3	2024-09-24 21:14:34.186443+07	2024-09-24 21:14:34.186443+07	\N	ผู้ช่วยศาสตราจารย์
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, created_at, updated_at, deleted_at, role_name) FROM stdin;
1	2024-09-24 21:14:34.195103+07	2024-09-24 21:14:34.195103+07	\N	student
2	2024-09-24 21:14:34.197005+07	2024-09-24 21:14:34.197005+07	\N	teacher
3	2024-09-24 21:14:34.198029+07	2024-09-24 21:14:34.198029+07	\N	admin
\.


--
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statuses (id, created_at, updated_at, deleted_at, status) FROM stdin;
1	2024-09-24 21:14:34.188508+07	2024-09-24 21:14:34.188508+07	\N	รอการเข้าพบ
2	2024-09-24 21:14:34.190622+07	2024-09-24 21:14:34.190622+07	\N	เข้าพบสำเร็จ
3	2024-09-24 21:14:34.192842+07	2024-09-24 21:14:34.192842+07	\N	ไม่ได้เข้าพบ
\.


--
-- Data for Name: time_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.time_slots (id, created_at, updated_at, deleted_at, user_id, slot_date, slot_start_time, slot_end_time, location, title, is_available) FROM stdin;
1	2024-09-24 21:15:26.143627+07	2024-09-24 21:15:26.143627+07	\N	1	2024-09-24 00:00:00+07	2024-09-24 08:00:00+07	2024-09-24 08:45:00+07	fdsfdsf	dfsfsd	t
3	2024-09-24 21:15:26.161304+07	2024-09-24 21:15:26.161304+07	\N	1	2024-09-24 00:00:00+07	2024-09-24 09:30:00+07	2024-09-24 10:15:00+07	fdsfdsf	dfsfsd	t
4	2024-09-24 21:15:26.165897+07	2024-09-24 21:15:26.165897+07	\N	1	2024-09-24 00:00:00+07	2024-09-24 10:15:00+07	2024-09-24 11:00:00+07	fdsfdsf	dfsfsd	t
2	2024-09-24 21:15:26.154956+07	2024-09-24 21:15:42.468979+07	\N	1	2024-09-24 00:00:00+07	2024-09-24 08:45:00+07	2024-09-24 09:30:00+07	fdsfdsf	dfsfsd	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, updated_at, deleted_at, position_id, full_name, role_id, advisor_id, email, image, facebook, line, contact_number, location, user_name, password, gender_id) FROM stdin;
1	2024-09-24 21:14:34.247287+07	2024-09-24 21:14:34.247287+07	\N	3	สมพงษ์ ดีงาน	2	\N	Sompong@gmail.com	\N	\N	\N	\N	\N	Sompong	$2a$10$fp65vojeld8CrQQoSOO.F.vy8aP4rKnjWoKXCAb2ITSf/GrsZ5G0G	1
2	2024-09-24 21:14:34.295203+07	2024-09-24 21:14:34.295203+07	\N	2	อลิยา ทองกาล	2	\N	Alia@gmail.com	\N	\N	\N	\N	\N	Alia	$2a$10$UchsvSW6wkEAQOw8Fs0nfOu6P7fdjwdJJMEsaANGO.QZdGWSxKxka	2
3	2024-09-24 21:14:34.342781+07	2024-09-24 21:14:34.342781+07	\N	1	อรัน บุตรดี	2	\N	Alan@gmail.com	\N	\N	\N	\N	\N	Alan	$2a$10$jHrYX2UnE3DcEfPIy.YlNOioRUoMM6Y.YgfFGI4r.p2QlHzwt6p9u	1
4	2024-09-24 21:14:34.38987+07	2024-09-24 21:14:34.38987+07	\N	1	แอดมิน เทส	3	\N	Admin@gmail.com	\N	\N	\N	\N	\N	Admin	$2a$10$r856VgvU2u3JJMN8RNwnNeckyGDPLtXRIerFZ7aP8bnG99FYktbFy	1
5	2024-09-24 21:14:34.43847+07	2024-09-24 21:14:34.43847+07	\N	\N	นักเรียน ดีเด่น	1	2	B6412345@gmail.com	\N	\N	\N	\N	\N	B6412345	$2a$10$V972q7sID1B3eZg6AP.S0OlkDqW6fknSWOStKmjY3LPr8DH97NeG.	1
6	2024-09-24 21:14:34.486518+07	2024-09-24 21:14:34.486518+07	\N	\N	นายตั้งใจ มาเรียน	1	2	B64126265@gmail.com	\N	\N	\N	\N	\N	student2	$2a$10$viaGvhqrm4q1x0iZ8tUsq.LYGz02Z3jhl3t6tCdLo2K3lqQcUnSEG	1
7	2024-09-24 21:14:34.534844+07	2024-09-24 21:14:34.534844+07	\N	\N	นายขย้นโดดเรียน	1	2	B641444444265@gmail.com	\N	\N	\N	\N	\N	student3	$2a$10$m2t.FqLari/SB6sGcB2ayuwJN0vKkmmFj9doN/45XHjyKer6lTmuy	1
8	2024-09-24 21:14:34.583603+07	2024-09-24 21:14:34.583603+07	\N	\N	เด็กดี วีสตาร์	1	1	B123456@gmail.com	\N	\N	\N	\N	\N	DekDeeVstart	$2a$10$U3x56KXbFrFPm4bpByxTquRxlXK2BNtE4mCskeycHmfpQW.G3L8vO	2
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, true);


--
-- Name: genders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genders_id_seq', 2, true);


--
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.positions_id_seq', 3, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statuses_id_seq', 3, true);


--
-- Name: time_slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.time_slots_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: genders genders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- Name: time_slots time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT time_slots_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_bookings_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_deleted_at ON public.bookings USING btree (deleted_at);


--
-- Name: idx_genders_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_genders_deleted_at ON public.genders USING btree (deleted_at);


--
-- Name: idx_genders_gender_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_genders_gender_name ON public.genders USING btree (gender_name);


--
-- Name: idx_positions_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_positions_deleted_at ON public.positions USING btree (deleted_at);


--
-- Name: idx_positions_position_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_positions_position_name ON public.positions USING btree (position_name);


--
-- Name: idx_roles_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_deleted_at ON public.roles USING btree (deleted_at);


--
-- Name: idx_roles_role_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_roles_role_name ON public.roles USING btree (role_name);


--
-- Name: idx_statuses_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_statuses_deleted_at ON public.statuses USING btree (deleted_at);


--
-- Name: idx_statuses_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_statuses_status ON public.statuses USING btree (status);


--
-- Name: idx_time_slots_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_time_slots_deleted_at ON public.time_slots USING btree (deleted_at);


--
-- Name: idx_users_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_deleted_at ON public.users USING btree (deleted_at);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_full_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_full_name ON public.users USING btree (full_name);


--
-- Name: idx_users_user_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_users_user_name ON public.users USING btree (user_name);


--
-- Name: bookings fk_bookings_time_slot; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_bookings_time_slot FOREIGN KEY (time_slot_id) REFERENCES public.time_slots(id);


--
-- Name: bookings fk_bookings_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users fk_genders_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_genders_users FOREIGN KEY (gender_id) REFERENCES public.genders(id);


--
-- Name: users fk_positions_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_positions_users FOREIGN KEY (position_id) REFERENCES public.positions(id);


--
-- Name: users fk_roles_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_roles_users FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: bookings fk_statuses_bookings; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_statuses_bookings FOREIGN KEY (status_id) REFERENCES public.statuses(id);


--
-- Name: time_slots fk_time_slots_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.time_slots
    ADD CONSTRAINT fk_time_slots_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users fk_users_advisor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_advisor FOREIGN KEY (advisor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

