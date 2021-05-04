CREATE TABLE public.chicago (
    id bigint,
    date timestamp without time zone,
    district bigint,
    block text,
    latitude double precision,
    description text,
    location_description text,
    community_area bigint,
    ward bigint,
    case_number text,
    year bigint,
    domestic boolean,
    fbi_code text,
    longitude double precision,
    primary_type text,
    arrest boolean,
	zip_code int
);

select * from chicago;
