import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Tag,
  Text,
  Textarea,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function ChatBox({ id }) {
  const [is_larger_than_md] = useMediaQuery("(min-width: 769px)");
  const [user, set_user] = useState({});
  const box_bg_colors = useColorModeValue("light.100", "dark.800");
  const text_colors = useColorModeValue("light.1000", "#fff3ec");
  const highlight_text_colors = useColorModeValue("#001858", "#fffffe");
  const btn_bg_colors = useColorModeValue("#f9bc60", "#fffffe");
  const btn_text_colors = useColorModeValue("dark.900", "dark.900");

  const btn_hover_colors = useColorModeValue("#272343", "#e3f6f5");
  const btn_hover_colors_text = useColorModeValue("light.100", "dark.900");
  const btn_border_colors = useColorModeValue("light.1000", "dark.100");
  const input_border_color = useColorModeValue("light.1000", "#fffffe");

  const [name, set_name] = useState("");
  const [pfp, set_pfp] = useState("");
  const [message, set_message] = useState("");
  const [room_id, set_room_id] = useState("");

  const [room_conversation, set_room_conversation] = useState([]);

  useEffect(() => {
    fetch_cur_room_messages();
    axios.get("/auth/current-session").then(({ data }) => {
      set_user(data);
      set_name(user.full_name);
      set_pfp(user.picture);
      set_room_id(id);
    });
  }, [room_id]);

  function fetch_cur_room_messages() {
    setInterval(async function () {
      await axios.get("/chat/" + room_id + "/messages").then((data) => {
        set_room_conversation(data);
        console.log(room_conversation, data);
      });
    }, 10000);
  }

  function handle_message_send() {
    console.log(message, name, pfp, room_id);
    axios({
      method: "post",
      url: "/chat/create_message/" + room_id,
      data: {
        name: JSON.stringify(name),
        message: JSON.stringify(message),
        pfp: JSON.stringify(pfp),
      },
    }).then((response) => {
      console.log(response);
    });

    set_message("");
  }

  function handle_input_change(e) {
    let input_value = e.target.value;
    set_message(input_value);
  }
  return (
    <Flex
      bg={box_bg_colors}
      p={7}
      borderRadius={"sm"}
      boxShadow={"lg"}
      maxW={"5xl"}
      w={{
        base: "fit-content",
        sm: "fit-content",
        lg: "5xl",
      }}
      h={{ sm: "fit-content", lg: "750px" }}
      overflow={"hidden"}
    >
      {is_larger_than_md && (
        <Flex direction={"column"} mt={0} mx={5}>
          <Box my={3}>
            <Image
              justify={"center"}
              backgroundColor="transparent"
              src={user.picture}
              clipPath={"circle()"}
              w={"100%"}
              h={"100%"}
            ></Image>
          </Box>
          <Box mt={3}>
            <Heading
              fontSize={"2xl"}
              w="full"
              color={highlight_text_colors}
              fontWeight="bold"
              textTransform={"uppercase"}
              pb={3}
              lineHeight={"8"}
            >
              {user.first_name} <br></br>
              {user.last_name}
            </Heading>
          </Box>
          <Flex position={"relative"} direction={"column"} align={"center"}>
            <Box>
              {user.mentee_profile_exists && (
                <Tag size={"lg"} borderRadius={"full"} colorScheme={"red"}>
                  Mentee
                </Tag>
              )}
            </Box>
            <Box mx={3}>
              {user.mentor_profile_exists && (
                <Tag size={"lg"} borderRadius={"full"} colorScheme={"green"}>
                  Mentor
                </Tag>
              )}
            </Box>
          </Flex>
        </Flex>
      )}
      <Divider
        orientation={"vertical"}
        mx={5}
        display={is_larger_than_md ? "block" : "none"}
      ></Divider>

      <Flex direction={"column"} justify={"center"}>
        <Stack w="full" h="full">
          <VStack w="full" h="full">
            <Box h={20} w="full" bg="red.300" />
            <Box h={20} w="full" bg="red.300" />
            <Box h={20} w="full" bg="red.300" />
            <Box h={20} w="full" bg="red.300" />
            <Box h={20} w="full" bg="red.300" />
            <Box h={20} w="full" bg="red.300" />
            <Box h={20} w="full" bg="red.300" />
            <Box h={20} w="full" bg="red.500">
              <HStack>
                <Textarea
                  resize="none"
                  value={message}
                  minInlineSize={!is_larger_than_md ? "none" : "2xl"}
                  borderWidth={"3px"}
                  placeholder=""
                  size="lg"
                  fontFamily="Inter"
                  fontSize={"md"}
                  onChange={handle_input_change}
                />
                <Flex align={"center"}>
                  <Link rounded={"md"}>
                    <Button
                      variant="outline"
                      alignItems="center"
                      w={{ base: "full", sm: "auto" }}
                      h={{ base: "full", lg: "auto" }}
                      position={"relative"}
                      size="xs"
                      cursor="pointer"
                      border={"3px solid"}
                      borderRadius={"6px"}
                      borderColor={"transparent"}
                      textTransform={"uppercase"}
                      padding={"7px 5px "}
                      transition={"all .2s ease"}
                      transition-timing-function="spring(4 100 10 10)"
                      _hover={{
                        transform: "translateY(-3px)",
                        shadow: "lg",
                      }}
                      boxShadow={"sm"}
                      color={text_colors}
                      bg={btn_bg_colors}
                      mx={1}
                      onClick={handle_message_send}
                    >
                      <Text
                        fontWeight={"bold"}
                        fontSize={"lg"}
                        textTransform={"uppercase"}
                        color={btn_text_colors}
                      >
                        {"Send"}
                      </Text>
                    </Button>
                  </Link>
                </Flex>
              </HStack>
            </Box>
          </VStack>
        </Stack>
      </Flex>
    </Flex>
  );
}

export default ChatBox;
